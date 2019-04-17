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
AWS.config.update({region: 'eu-west-1'});

const SES = new AWS.SES();

let mailer = nodemailer.createTransport(sesTransport({
    ses: SES
}));

const msg = {
    to: 'dev@percayso.com',
    from: emailSender,
    subject: 'Data backup status',
    text: `Mongodb data has been successfully backed up to S3!`,
    html: `<h3>Mongodb data has been successfully backed up to S3!</h3>`
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