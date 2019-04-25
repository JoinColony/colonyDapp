curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-243.0.0-linux-x86_64.tar.gz
tar zxvf google-cloud-sdk-243.0.0-linux-x86_64.tar.gz google-cloud-sdk
sudo mv google-cloud-sdk /opt/google-cloud-sdk
export PATH="$PATH:/opt/google-cloud-sdk/bin"
echo $GCLOUD_SERVICE_KEY | base64 --decode > ${HOME}/gcloud-service-key.json
/opt/google-cloud-sdk/bin/gcloud --quiet components update
/opt/google-cloud-sdk/bin/gcloud --quiet components update kubectl
/opt/google-cloud-sdk/bin/gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
/opt/google-cloud-sdk/bin/gcloud config set project $PROJECT_NAME
/opt/google-cloud-sdk/bin/gcloud --quiet config set container/cluster $CLUSTER_NAME
/opt/google-cloud-sdk/bin/gcloud config set compute/zone ${CLOUDSDK_COMPUTE_ZONE}
/opt/google-cloud-sdk/bin/gcloud --quiet container clusters get-credentials $CLUSTER_NAME
/opt/google-cloud-sdk/bin/gcloud auth activate-service-account --key-file ~/gcloud-service-key.json
gcloud auth configure-docker --quiet
docker push eu.gcr.io/${PROJECT_NAME}/dapp:$CIRCLE_SHA1

