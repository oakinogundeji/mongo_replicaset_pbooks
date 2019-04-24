'use strict';

const
  {exec, execFile} = require('child_process'),
  {promisify} = require('util'),
  execAsync = promisify(exec),
  execFileAsync = promisify(execFile);

async function getGateway() {
  const {stdout, stderr, error} = await execFileAsync('ip', [`route`]);
  //console.log('stdout');
  //console.log(stdout);
  //console.log(`typeof(stdout): ${typeof(stdout)}`);
  let stdoutArr = stdout.split('default via');
  //console.log('stdoutArr');
  //console.log(stdoutArr);
  let targetLine = stdoutArr[1].trim();
  //console.log(`targetLine: ${targetLine}`);
  const targetLineArr = targetLine.split(' ');
  //console.log('targetLineArr');
  //console.log(targetLineArr);
  const gateway = targetLineArr[0];
  //console.log(`gateway: ${gateway}`);
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
