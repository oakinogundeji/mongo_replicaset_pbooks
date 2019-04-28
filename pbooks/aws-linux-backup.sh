#!/bin/bash

# create snapshot of /data dir labelling it `data_backup` using all the free space on the volume
sudo lvcreate -l 100%FREE -s -n data_backup /dev/mongo_data/data
# create mount point for snapshot
sudo mkdir /data_backup /home/ec2-user/backup
# mount snapshot
sudo mount /dev/mongo_data/data_backup /data_backup -onouuid,ro
# copy data from snapshot to /home/ec2-user/backup
sudo tar -czvf /home/ec2-user/backup/mongo_data.tar.gz /data_backup
# unmount the snapshot when backup completes
sudo umount /data_backup
# delete the mount point
sudo rm -r /data_backup
# delete the snapshot
sudo lvremove -f /dev/mongo_data/data_backup
# delete previous backup
aws s3 rm s3://${2}/mongo_data.tar.gz
# copy tar archive from /home/ec2-user/backup/mongo_data to S3 bucket
aws s3 cp /home/ec2-user/backup/mongo_data.tar.gz s3://${2}/mongo_data.tar.gz --storage-class 'STANDARD_IA'
# remove the /home/ec2-user/backup directory
sudo rm -r /home/ec2-user/backup
# trigger email notification on successful backup
/usr/bin/node /home/ec2-user/playbooks/pbooks/awslinux/notifier/backup-notifier.js ${1}
