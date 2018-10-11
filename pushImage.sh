echo $GCLOUD_SERVICE_KEY | base64 --decode > ${HOME}/gcloud-service-key.json
sudo /usr/bin/google-cloud-sdk/bin/gcloud --quiet components update
sudo /usr/bin/google-cloud-sdk/bin/gcloud --quiet components update kubectl
sudo /usr/bin/google-cloud-sdk/bin/gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
sudo /usr/bin/google-cloud-sdk/bin/gcloud config set project $PROJECT_NAME
sudo /usr/bin/google-cloud-sdk/bin/gcloud --quiet config set container/cluster $CLUSTER_NAME
sudo /usr/bin/google-cloud-sdk/bin/gcloud config set compute/zone ${CLOUDSDK_COMPUTE_ZONE}
sudo /usr/bin/google-cloud-sdk/bin/gcloud --quiet container clusters get-credentials $CLUSTER_NAME

sudo /usr/bin/google-cloud-sdk/bin/gcloud docker --docker-host=$DOCKER_HOST -- --tlsverify --tlscacert $DOCKER_CERT_PATH/ca.pem --tlscert $DOCKER_CERT_PATH/cert.pem --tlskey $DOCKER_CERT_PATH/key.pem push eu.gcr.io/${PROJECT_NAME}/dapp:$CIRCLE_SHA1
