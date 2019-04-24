'use strict';



//const inputJSON = JSON.parse(input);

async function getEni() {
  const input = process.argv[2];

  console.log(input);
  console.log(`typeof(input): ${typeof(input)}`);
  let inputJSON = JSON.parse(input);
  console.log(`typeof(inputJSON): ${typeof(inputJSON)}`);
  /*

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
  */
}

getEni();
