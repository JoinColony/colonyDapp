FROM circleci/node:10.14

USER root

# Supress the Chrome package key warning
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE 1
# The Linuxbrew install script needs the USER value set in the env
# It will not use actual logged in one
ENV USER root
# Manually set Linuxbrew ENV variables
ENV HOMEBREW_PREFIX "/home/linuxbrew/.linuxbrew"
ENV HOMEBREW_CELLAR "/home/linuxbrew/.linuxbrew/Cellar"
ENV HOMEBREW_REPOSITORY "/home/linuxbrew/.linuxbrew/Homebrew"
ENV PATH "/home/linuxbrew/.linuxbrew/bin:/home/linuxbrew/.linuxbrew/sbin:${PATH}"

# Update the apt cache
RUN apt-get update

# install cypress dependencies
RUN apt-get install -y \
  libgtk2.0-0 \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libnss3-tools \
  libxss1 \
  libasound2 \
  xvfb \
  vnc4server \
  metacity \
  build-essential \
  curl \
  file

RUN node --version
RUN echo "force new chrome here"

# install Chromebrowser
RUN \
  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
  apt-get update && \
  apt-get install -y dbus-x11 google-chrome-stable && \
  rm -rf /var/lib/apt/lists/*

# Add zip utility - it comes in very handy
RUN apt-get install -y zip

# Reconfigure locales
RUN echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
RUN locale-gen

# versions of local tools
RUN node -v
RUN npm -v
RUN yarn -v
RUN google-chrome --version
RUN zip --version
RUN git --version

# We need to create the cache folder initially (as the circleci user),
# otherwise the Linuxbrew install script will create a subfolder using
# sudo (.cache/Homebrew), which will create `.cache` recursively, with
# root:root as an owner, making it impossible for use to use it from the
# circle runner
RUN mkdir ~/.cache

# Install Linuxbrew
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
# Configure Linuxbrew in the current .profile
RUN echo "eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)" >> ~/.profile
# Opt-out of Linuxbrew analytics
RUN brew analytics off

# Install mkcert using Linuxbrew
RUN brew install mkcert
# Generate local CA certificates
RUN mkcert -install

RUN mkdir colonyDapp
COPY ./ ./colonyDapp/
WORKDIR "/colonyDapp"
RUN mkdir -p /root/.ssh
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN apt-get -y install openssh-client
RUN ssh-keygen -q -t rsa -N '' -f /root/.ssh/id_rsa
RUN yarn
RUN yarn provision --skip-colony-network-build
RUN sed -i "s/docker: true,/docker: false,/g" /colonyDapp/src/lib/colonyNetwork/truffle.js
RUN yarn provision

# Now let's work out what the hell we're doing with nginx
# RUN apt-get update
# RUN apt-get install nginx
# COPY ./docker/nginx.conf /etc/nginx/nginx.conf
# COPY ./docker/gen-ssl.sh /etc/nginx/gen-ssl.sh
# WORKDIR "/etc/nginx/"
# RUN bash /etc/nginx/gen-ssl.sh
# WORKDIR "/colonyDapp"
# RUN sed -i "s|hotOnly: true|hotOnly :true,host: '0.0.0.0',disableHostCheck:true|g" ./webpack.config.js
# CMD service nginx start && yarn dev

EXPOSE 443
EXPOSE 9090
