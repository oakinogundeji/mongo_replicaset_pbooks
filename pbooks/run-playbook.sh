#!/bin/bash

ansible-playbook -i /home/ec2-user/playbooks/pbooks/ec2.py -c local /home/ec2-user/playbooks/pbooks/awslinux/data-nodes.yml --extra-vars "BACKUP_BUCKET=tss-nazar-mongod-test EMAIL_SENDER=tss@tssdevs.com"
