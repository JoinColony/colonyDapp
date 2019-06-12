FROM node:10.12

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

RUN mkdir colonyDapp
