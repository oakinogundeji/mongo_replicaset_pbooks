'use strict';
//=============================================================================
/**
 * Module dependencies
 */
//=============================================================================
const
    AWS = require('aws-sdk'),
    nodemailer = require('nodemailer'),
    sesTransport = require('nodemailer-ses-transport'),
    hostname = process.argv[2],
    eniDNS = process.argv[3],
    emailSender = process.argv[4],
    eniPrivateIP = process.argv[5];
//=============================================================================
/**
 * Module config
 */
//=============================================================================
AWS.config.update({region: 'us-east-1'});

const SES = new AWS.SES();

let mailer = nodemailer.createTransport(sesTransport({
    ses: SES
}));

const msg = {
    to: 'oakinogundeji@gmail.com',
    from: emailSender,
    subject: 'Replica set member status',
    text: `The replica set member with hostname ${hostname}, ENI DNS ${eniDNS} and ENI private IP ${eniPrivateIP} is up!`,
    html: `<p>The replica set member with hostname <em>${hostname}</em>, ENI DNS <em>${eniDNS}</em>, and ENI IP <em>${eniPrivateIP}</em> is up!</p>`
};
//=============================================================================
/**
 * Module functionality
 */
//=============================================================================
function sesMail(msg) {
    return mailer.sendMail(msg, (err, result) => {
      if(err) {
          console.log('There was an ses error');
          return console.error(err);
      } else {
          console.log('Success...');
          return console.log(result);
      };
    })
}
//=============================================================================
sesMail(msg);
//=============================================================================
