echo $GCLOUD_SERVICE_KEY | base64 --decode > ${HOME}/gcloud-service-key.json
sudo apt-get install kubectl
gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
 gcloud config set project $PROJECT_NAME
gcloud --quiet config set container/cluster $CLUSTER_NAME
gcloud config set compute/zone ${CLOUDSDK_COMPUTE_ZONE}
gcloud --quiet container clusters get-credentials $CLUSTER_NAME
cat ~/gcloud-service-key.json | jq -r .private_key > ~/.ssh/google_compute_engine
chmod 0600 ~/.ssh/google_compute_engine
ssh-keygen -y -f ~/.ssh/google_compute_engine > ~/.ssh/google_compute_engine.pub
