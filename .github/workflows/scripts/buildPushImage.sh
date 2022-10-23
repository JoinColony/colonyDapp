#!/bin/bash
set -e

# Commenting out payload processing as triggering workflow with env variable for now

# Move the variables from the payload in to env variables
# PAYLOAD=`cat $GITHUB_EVENT_PATH | jq -r '.client_payload'`
# $(echo $PAYLOAD | jq -r 'keys[] as $k | "export \($k)=\(.[$k])"')

echo "Building frontend image"
echo $COMMIT_HASH

if [ -z "$DEV" ]; then
      TAG=$COMMIT_HASH
   else
      TAG=$COMMIT_HASH-dev
fi
   
docker build --build-arg DEV=${DEV} --no-cache -t 268828583045.dkr.ecr.eu-west-2.amazonaws.com/$ECR_REPOSITORY:$TAG .

docker push 268828583045.dkr.ecr.eu-west-2.amazonaws.com/$ECR_REPOSITORY:$TAG

