'use strict';

const input = process.argv[2];

async function getEni(input) {
  const eni = input.filter(eni => eni["description"].includes('node'));
  const output = eni.map(eni => {
    return {
      "description": eni["description"],
      "availability_zone": eni["availability_zone"],
      "id": eni["id"],
      "mac_address": eni["mac_address"],
      "private_dns_name": eni["private_dns_name"],
      "private_ip_address": eni["private_ip_address"],
      "subnet_id": eni["subnet_id"]
    }
  });
  return console.log(output);
}

getEni(input);
