#!/bin/bash

if [ ! $1 ]; then
        echo " Example of use: $0 database_name [dir_to_store]"
        exit 1
fi
db=$1
out_dir=/home/ec2-user/collection_backup
if [ ! $out_dir ]; then
        out_dir="./"
else
        mkdir -p $out_dir
fi

tmp_file="fadlfhsdofheinwvw.js"
echo "print('_ ' + db.getCollectionNames())" > $tmp_file
cols=`mongo $db $tmp_file | grep '_' | awk '{print $2}' | tr ',' ' '`
for c in $cols
do
    mongoexport -d $db -c $c -o "$out_dir/${c}.json" --jsonArray
		tar -czvf $out_dir/${c}.json.tar.gz $out_dir/${c}.json
		rm $out_dir/${c}.json
		aws s3 cp $out_dir/${c}.json.tar.gz s3://${3}/${c}.json.tar.gz --storage-class 'STANDARD_IA'
		rm $out_dir/${c}.json.tar.gz
done
# remove temp file
rm $tmp_file
# trigger email notification on successful backup
/usr/bin/node /home/ec2-user/playbooks/pbooks/awslinux/notifier/collection-backup-notifier.js ${2}
