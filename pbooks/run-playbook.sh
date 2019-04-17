#!/bin/bash -v

ansible-playbook -i /home/ubuntu/playbooks/ec2.py \
    -c local /home/ubuntu/playbooks/playbooks/data-nodes.yml \
    --extra-vars "BACKUP_BUCKET=${1}"
