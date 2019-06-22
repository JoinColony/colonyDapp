# Dapp production deployment notes

A few notes on how to deploy the app and the whole tech stack to production.

_This is not a complete guide (yet)!_ We have to do that first and then gather some experiences from that before we can do that. This is solely to provide the necessary information to be able to understand the inner workings of all the parts involved.

## Prerequisites

* [star-signal-ws-rendezvous](https://hub.docker.com/r/joincolony/star-signal-ws-rendezvous)
* [pinion](https://hub.docker.com/r/joincolony/pinion)
* A docker image built from the Dockerfile included here

## Set up the star server

The [star-server](https://hub.docker.com/r/joincolony/star-signal-ws-rendezvous) requires no configuration. It just has to be started and will run on port `9090` of the container which can be utilized as needed. Note that it has to be _exposed to the public and should get an own subdomain (in the best case)_ as the Dapp-clients have to connect to that. When using an nginx proxy/ingress, note that the forwarding has to be websocket enabled.

### pinion

The [pinion](https://hub.docker.com/r/joincolony/pinion) docker image can be run by running the docker image while setting certain environment variables. The directory holding all the pinned data can be specified as well (`./orbitdb`) and should be mounted to a docker volume that is backed up regularly on running the image. If using the default this would be `/pinion/orbitdb` on the container.

We need to set the following [environment variables](https://github.com/JoinColony/pinion#custom-configuration):

* `PINION_IPFS_CONFIG_FILE`: Point to a file that holds the ipfs configuration. See ipfsConfig.production.example.json for an example.
* `PINION_IPFS_REPO`: This is the directory pinion uses to hold all the ipfs data. This should be mounted to a persistent volume.
* `PINION_IPFS_PRIVATE_KEY`: Optionally define a private key to generate the identity used by IPFS.
* `PINION_ROOM`: This has to be set to the _same_ environment variable as the `PINNING_ROOM` env variable for the Dapp. This is vital for the pinner to work! Here we can use any string as long as it's the same on all clients.
* `PINION_MAX_OPEN_STORES`: We have to play around with that variable a bit and monitor memory and CPU usage of the pinion daemon. I'd suggest to set it to around 200-500 in the beginning and see where it goes.
* `PINION_ORBIT_DB_DIR`: This will be the directory on the container which contains all of orbits pinned store data. It's set to `./orbitdb` by default which resolves to the relative position of the directory to the pinner one (`/pinion/orbitdb`) on the container.

### Dapp

The [dApp production](https://github.com/JoinColony/colonyDapp/blob/master/Dockerfile) docker image builds the production version of the bundle, moves it to separate folder, and serves it via a simple `nginx` server on port `80`

The `Dockerfile` just needs to be built, and run. The `nginx` service `CMD` will keep the container alive.

#### Build Args

This docker file allows you to pass in build time arguments to change the environment the dApp's bundle is being built with. The only one of these that is **required** is the `GH_PAT` one, without which, you won't be able to pull in the `colonyDapp` repo.

Build args:
- `GH_PAT`: the GitHub Personal Access Token **required** to authenticate and pull information from our private repo _(Note: you **have to** supply this yourself, otherwise it won't work)_.
- `LOADER`: Loader value to be passed to the dApp's environment, defaults to `network`
- `NETWORK`: Network value to be passed to the dApp's environment, defaults to `goerli`
- `VERBOSE`: If the dApp's console output should be verbose or not, defaults to `false`
- `COLONY_NETWORK_ENS_NAME`: The ENS name the dApp should use for users and colonies, defaults to `joincolony.eth`
- `PINNING_ROOM`: The `pinion` pinning room's name to use, defaults to `PINION_DEV_ROOM`

Usage example: _(Build for a draft release)_
```bash
docker build --build-arg GH_PAT='your-github-personal-access-token' --build-arg COLONY_NETWORK_ENS_NAME='joincolony.test' --build-arg VERBOSE='true' .
```
