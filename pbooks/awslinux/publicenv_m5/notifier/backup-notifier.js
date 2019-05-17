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
    emailSender = process.argv[2];
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
    subject: 'Data backup status',
    text: `Mongodb data has been successfully backed up to S3!`,
    html: `<p>Mongodb data has been successfully backed up to S3!</p>`
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
