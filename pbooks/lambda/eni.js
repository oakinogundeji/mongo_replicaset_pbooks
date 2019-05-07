'use strict';

const
  Promise = require('bluebird'),
  AWS = require('aws-sdk');;

AWS.config.update({
  region: 'ca-central-1'
});

AWS.config.setPromisesDependency(Promise);

const
  ec2 = new AWS.EC2 (),
  autoscaling = new AWS.AutoScaling();

exports.default = async (event, context, cbk) => {
  // get instanceID and asgToken
  const
    newInstanceID = event["detail"]["EC2InstanceId"],
    asgToken = event["detail"]["LifecycleActionToken"];
  //look for available ENIs
  const eniParams = {
    Filters: [
      {
        Name: 'status',
        Values: [
          'available'
        ]
      }
    ]
  };
  const enis = await ec2.describeNetworkInterfaces(eniParams).promise();
  console.log('all enis');
  console.log(enis);

  const instanceParams = {
    InstanceIds: [`${newInstanceID}`]
  };
  const newInstanceDetails = await ec2.describeInstances(instanceParams).promise();
  console.log('newInstanceDetails');
  console.log(JSON.stringify(newInstanceDetails));

  const
    targetAZ = newInstanceDetails["Reservations"][0]["Instances"][0]["Placement"]["AvailabilityZone"],
    targetSubnet = newInstanceDetails["Reservations"][0]["Instances"][0]["SubnetId"];

  console.log(`targetAZ: ${targetAZ}, targetSubnet: ${targetSubnet}`);

  // ensure the right ENI is selected

  const gotMatch = enis["NetworkInterfaces"].filter(eni => eni.AvailabilityZone == targetAZ && eni.SubnetId == targetSubnet);
  if(!!gotMatch && gotMatch[0]["Description"].includes('transitfare')) {
    console.log('gotMatch');
    console.log(gotMatch);

    // attach ENI to new instance
    const attachENIparams = {
      DeviceIndex: 1,
      InstanceId: `${newInstanceID}`,
      NetworkInterfaceId: `${gotMatch[0].NetworkInterfaceId}`
     };
     console.log(`gotMatch[0].NetworkInterfaceId: ${gotMatch[0].NetworkInterfaceId}`);
     const attachedENI = await ec2.attachNetworkInterface(attachENIparams).promise();
     console.log('attachedENI');
     console.log(attachedENI);

     // allow ASG to continue

     const asgParams = {
       AutoScalingGroupName: 'dummy-lc-asg',
       LifecycleActionResult: 'CONTINUE',
       LifecycleHookName: 'data-node-up-hook',
       LifecycleActionToken: `${asgToken}`
     };
     const continueASG = await autoscaling.completeLifecycleAction(asgParams).promise();
     console.log('continueASG');
     console.log(continueASG);

     // return

     const output = {
       statusCode: 200,
       body: JSON.stringify({
         message: 'Successfully attached ENI to new instance via ASG lifecycle hooks',
         input: event,
         enis,
         newInstanceDetails
       }),
     };
     return output;
  }
  return null;
};
