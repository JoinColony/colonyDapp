FROM node:14.18.0-bullseye

ARG DEV

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

# Install new version of NPM
RUN npm i -g npm@8.2 --registry=https://registry.npmjs.org

# Copy colonyDapp
COPY . ./colonyDapp

WORKDIR /colonyDapp

# Install node_modules
RUN npm ci

# If the DEV build arg was set, then build the bundle in development mode
# Otherwise, build the normal production bundle
RUN if [ -z "$DEV" ]; then npm run webpack:build:prod; else npm run webpack:build; fi

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

# @NOTE Hack!
# We replace the environment variables in the built bundle with the ones declared in the kubernetes config
# This is necessary since we aren't in a actual node process, they're just files served by nginx
# Doing it like this allows us to use the same image for different deployments
RUN if [ -z "$DEV" ]; then export PROCESS_VAR='[a-z]'; else export PROCESS_VAR='process'; fi && \
        echo "sed -i \"s|${PROCESS_VAR}.env.SERVER_ENDPOINT|\\\"\$SERVER_ENDPOINT\\\"|g\" *.js" \
        "&& sed -i \"s|${PROCESS_VAR}.env.SUBGRAPH_ENDPOINT|\\\"\$SUBGRAPH_ENDPOINT\\\"|g\" *.js" \
        "&& sed -i \"s|${PROCESS_VAR}.env.KYC_ORACLE_ENDPOINT|\\\"\$KYC_ORACLE_ENDPOINT\\\"|g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.LOADER/\\\"\$LOADER\\\"/g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.PINATA_API_KEY/\\\"\$PINATA_API_KEY\\\"/g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.PINATA_API_SECRET/\\\"\$PINATA_API_SECRET\\\"/g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.NETWORK_CONTRACT_ADDRESS/\\\"\$NETWORK_CONTRACT_ADDRESS\\\"/g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.NETWORK/\\\"\$NETWORK\\\"/g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.VERBOSE/\\\"\$VERBOSE\\\"/g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.COLONY_NETWORK_ENS_NAME/\\\"\$COLONY_NETWORK_ENS_NAME\\\"/g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.META_WRAPPED_TOKEN_ADDRESS/\\\"\$META_WRAPPED_TOKEN_ADDRESS\\\"/g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.META_VESTING_CONTRACT_ADDRESS/\\\"\$META_VESTING_CONTRACT_ADDRESS\\\"/g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.INFURA_ID/\\\"\$INFURA_ID\\\"/g\" *.js" \
        "&& sed -i \"s|${PROCESS_VAR}.env.RPC_URL|\\\"\$RPC_URL\\\"|g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.USERFLOW_TOKEN/\\\"\$USERFLOW_TOKEN\\\"/g\" *.js" \
        "&& sed -i \"s/${PROCESS_VAR}.env.METATRANSACTIONS/\\\"\$METATRANSACTIONS\\\"/g\" *.js" \
        "&& sed -i \"s|${PROCESS_VAR}.env.BROADCASTER_ENDPOINT|\\\"\$BROADCASTER_ENDPOINT\\\"|g\" *.js" \
        "&& sed -i \"s|${PROCESS_VAR}.env.PINATA_GATEWAY|\\\"\$PINATA_GATEWAY\\\"|g\" *.js" \
        "&& sed -i \"s|${PROCESS_VAR}.env.BEAMER_PRODUCT_ID|\\\"\$BEAMER_PRODUCT_ID\\\"|g\" *.js" \
        " && nginx -g 'daemon off;'" > ./run.sh
RUN chmod +x ./run.sh

# @NOTE Run the actual command, rather then the service
# so that the docker container won't exit
CMD ./run.sh
# READY TO GO !
