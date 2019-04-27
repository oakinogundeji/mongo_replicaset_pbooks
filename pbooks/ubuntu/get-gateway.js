'use strict';

const
  {execFile} = require('child_process'),
  {promisify} = require('util'),
  execFileAsync = promisify(execFile);

async function getGateway() {
  const {stdout, stderr, error} = await execFileAsync('ip', [`route`]);
  let stdoutArr = stdout.split('default via');
  let targetLine = stdoutArr[1].trim();
  const targetLineArr = targetLine.split(' ');
  const gateway = targetLineArr[0];
  return console.log(gateway);
  if(error){
    console.log('error');
    return error;
  }
  if(stderr) {
    console.log('stderr');
    return stderr;
  }
}

getGateway();
