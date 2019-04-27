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
    {execFile} = require('child_process'),
    {promisify} = require('util'),
    execFileAsync = promisify(execFile),
    emailSender = process.argv[2];
//=============================================================================
/**
 * Module config
 */
//=============================================================================
AWS.config.update({region: 'us-east-1'});

const SES = new AWS.SES();

async function getHostname() {
  const {stdout, stderr, error} = await execFileAsync('hostname');
  console.log('stdout');
  console.log(stdout);
  return stdout;
  if(error){
    console.log('error');
    return error;
  }
  if(stderr) {
    console.log('stderr');
    return stderr;
  }
}

let mailer = nodemailer.createTransport(sesTransport({
    ses: SES
}));
//=============================================================================
/**
 * Module functionality
 */
//=============================================================================
function sesMail(hostname) {
  const msg = {
      to: 'oakinogundeji@gmail.com',
      from: emailSender,
      subject: 'Replica set member status',
      text: `The replica set member with hostname ${hostname} is up!`,
      html: `<p>The replica set member with hostname <em>${hostname}</em> is up!</p>`
  };
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
getHostname()
  .then(name => sesMail(name))
  .catch(err => console.error(err));
//=============================================================================
