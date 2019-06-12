FROM node:10.12

# NOTE
#
# This Dockerfile pulls in a private repository
# In order to accomplish this, it makes use of a GH Personal Access Token:
# https://github.com/settings/tokens (Make sure you have the `repo` scope)
#
# Make sure you either set it in your environment or build the docker image with it
# Eg: docker build --build-arg GH_PAT='XXX' .
ARG GH_PAT

# Fix Debian Jessie / Docker issue with apt.
# See:https://stackoverflow.com/questions/46406847/docker-how-to-add-backports-to-sources-list-via-dockerfile
RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list

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
  zip

# Reconfigure locales
RUN echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
RUN locale-gen

# Clone the repo
RUN git clone "https://$GH_PAT@github.com/JoinColony/colonyDapp.git"
WORKDIR colonyDapp

# Install node_modules
RUN yarn

# Build the production bundle
RUN yarn webpack:build

# Copy the production bundle
RUN mkdir ../colonyDappProd
RUN cp -R ./dist/* ../colonyDappProd

# Cleanup the source folder
WORKDIR /
RUN rm -Rf colonyDapp

WORKDIR colonyDappProd
