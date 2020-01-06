FROM node:10.16.3

# @NOTE This Dockerfile pulls in a private repository
# In order to accomplish this, it makes use of a GH Personal Access Token:
# https://github.com/settings/tokens (Make sure you have the `repo` scope, ...and only that)
#
# Make sure you either set it in your environment or build the docker image with it
# Eg: docker build --build-arg GH_PAT='XXX' .
ARG GH_PAT
# @NOTE This is required to be set at build time, otherwise calls to infura might fail
# Also, due to security considerations, we're not storing it here
#
# Eg: docker build --build-arg INFURA_ID='XXX' .
ARG INFURA_ID
# @NOTE Declare the commit hash build variable, so that it gets picked up by the conditional
ARG COMMIT_HASH

# Make the dapp's ENV values to have the option to be set at build time
# But fall back to a default
ARG LOADER=network
ARG NETWORK=goerli
ARG CHAIN_ID=5
ARG VERBOSE=false
ARG COLONY_NETWORK_ENS_NAME=joincolony.eth

# @FIX Allow the nginx service to start at build time, so that the installation will work
# See: https://askubuntu.com/questions/365911/why-the-services-do-not-start-at-installation
RUN sed -i "s|exit 101|exit 0|g" /usr/sbin/policy-rc.d

# Update the apt cache
RUN apt-get clean
RUN apt-get update

# Apt-utils needs to be in before installing the rest
RUN apt-get install -y \
        locales \
        apt-utils \
        build-essential \
        curl \
        file \
        zip \
        nginx

# Reconfigure locales
RUN echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
RUN locale-gen

# Clone the repo
RUN git clone "https://$GH_PAT@github.com/JoinColony/colonyDapp.git"
WORKDIR /colonyDapp
RUN if [ ! -z "$COMMIT_HASH" ]; then git checkout $COMMIT_HASH; fi

# Install node_modules
RUN yarn

# Setup the repo's ENV file
RUN echo "LOADER=$LOADER\n" \
        "CHAIN_ID=$CHAIN_ID\n" \
        "INFURA_ID=$INFURA_ID\n" \
        "NETWORK=$NETWORK\n" \
        "VERBOSE=$VERBOSE\n" \
        "COLONY_NETWORK_ENS_NAME=$COLONY_NETWORK_ENS_NAME\n" > .env

# Build the production bundle
RUN yarn webpack:build:prod

# Copy the production bundle
RUN mkdir ../colonyDappProd
RUN cp -R ./dist/* ../colonyDappProd

# Cleanup the source folder
WORKDIR /
RUN rm -Rf colonyDapp
WORKDIR /colonyDappProd

# Setup a basic nginx config
RUN echo "server {\n" \
        "    listen       80;\n" \
        "    server_name  default_server;\n\n" \
        "    location / {\n" \
        "        root   /colonyDappProd;\n" \
        "        try_files \$uri /index.html;\n" \
        "    }\n" \
        "}" > /etc/nginx/sites-available/default

# Expose the HTTP port
EXPOSE 80

# @NOTE Run the actual command, rather then the service
# so that the docker container won't exit
CMD ["nginx", "-g", "daemon off;"]

# READY TO GO !
