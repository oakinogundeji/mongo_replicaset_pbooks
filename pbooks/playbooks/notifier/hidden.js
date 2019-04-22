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
    emailSender = process.argv[3];
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
    text: `The replica set hidden member with hostname ${hostname}, ENI DNS ${eniDNS} and ENI IP ${eniIP} is up!`,
    html: `<h3>The replica set hidden member with hostname <em>${hostname}</em>, ENI DNS <em>${eniDNS}</em>, and ENI IP <em>${eniIP}</em> is up!</h3>`
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
