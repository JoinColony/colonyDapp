# Dapp production deployment notes

A few notes on how to deploy the app and the whole tech stack to production.

_This is not a complete guide (yet)!_ We have to do that first and then gather some experiences from that before we can do that. This is solely to provide the necessary information to be able to understand the inner workings of all the parts involved.

## Prerequisites

* [star-signal-ws-rendezvous](https://hub.docker.com/r/joincolony/star-signal-ws-rendezvous)
* [pinion](https://hub.docker.com/r/joincolony/pinion)
* Either [js-ipfs](https://hub.docker.com/r/joincolony/js-ipfs) or [go-ipfs](https://hub.docker.com/r/ipfs/go-ipfs)
* A docker image built from the Dockerfile included here

## Set up the star server

The [star-server](https://hub.docker.com/r/joincolony/star-signal-ws-rendezvous) requires no configuration. It just has to be started and will run on port `9090` of the container which can be utilized as needed. Note that it has to be _exposed to the public and should get an own subdomain (in the best case)_ as the Dapp-clients have to connect to that. When using an nginx proxy/ingress, note that the forwarding has to be websocket enabled.

## Set up an IPFS daemon

We can either use the official go-ipfs image or our custom js-ipfs image. The only difference there is the directory the config and data files have to be mounted into. The pre-configuration is important as the Dapp as well as the pinner will need information from the configured node. This is specifically true for the public key of the ipfs node which serves as a part of its address. The process to run the ipfs nodes via docker is almost the same for both images. You mount a directory (which is different in the containers) and forward some ports. Here's a port overview:

`4001` - swarm http port for IPFS connections
`4003` - swarm http websocket port for IPFS connections
`5001` - API port
`8080` - Gateway port

We probably don't want to expose the gateway port unless we want to run a public gateway. The reset of the ports are required.

These ports are ideally configured in the config file that is mounted for the according image (the file is just called `config` in both images):

```
"Addresses": {
  "API": "/ip4/0.0.0.0/tcp/5001",
  "Gateway": "/ip4/0.0.0.0/tcp/8080",
  "Swarm": [
    "/ip4/0.0.0.0/tcp/4001",
    "/ip6/::/tcp/4001",
    "/ip4/0.0.0.0/tcp/4003/ws",
    "/ip6/::/tcp/4003/ws"
  ]
}
```

We also have to add the star server to the swarm nodes (and adjust the _internal(!)_ address and port to the star server created above!):

```
"Swarm": [
  // ..
  "/ip4/127.0.0.1/tcp/9091/ws/p2p-websocket-star"
]
```

**Important** For either of the options you need to note down the public key (available in the `config` file under `Identity.PeerID`).

For IPFS the config directory is at the same time the directory the node stores its data in, so we want to handle that as any volume that contains critical data (backups, etc).

### Using go-ipfs

Files that are necessary (these - amonst others - are created when you initialize the daemon):

* `config`
* `datastore_spec`
* `version`

A folder containing these files has to be mounted to `/data/ipfs` on the container. The `config` file is the only file you need to edit (see above). An example command to run the container (including mounting the volume and forwarding the ports) would be:

```
docker run -v /path/to/config/dir:/data/ipfs -p 4001:4001 -p 4003:4003 -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs:v0.4.20 daemon --enable-pubsub-experiment
```

Don't forget to add `--enable-pubsub-experiment`, to enable pubsub, which we need!

### Using js-ipfs

Files that are necessary (these - amonst others - are created when you initialize the daemon):

* `config`
* `version`

A folder containing these files has to be mounted to `/root/.jsipfs` on the container. The `config` file is the only file you need to edit (see above). An example command to run the container (including mounting the volume and forwarding the ports) would be:

```
docker run -v /path/to/config/dir:/root/.jsipfs -p 4001:4001 -p 4003:4003 -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 joincolony/js-ipfs:latest daemon --enable-pubsub-experiment
```

### pinion

The [pinion](https://hub.docker.com/r/joincolony/pinion) docker image can be run by running the docker image while setting certain environment variables. The directory holding all the pinned data can be specified as well (`./orbitdb`) and should be mounted to a docker volume that is backed up regularly on running the image. If using the default this would be `/pinion/orbitdb` on the container.

We need to set the following [environment variables](https://github.com/JoinColony/pinion#custom-configuration):

* `PINION_ROOM`: This has to be set to the _same_ environment variable as the `PINNING_ROOM` env variable for the Dapp. This is vital for the pinner to work! Here we can use any string as long as it's the same on all clients.
* `PINION_MAX_OPEN_STORES`: We have to play around with that variable a bit and monitor memory and CPU usage of the pinion daemon. I'd suggest to set it to around 200-500 in the beginning and see where it goes.
* `PINION_IPFS_DAEMON_URL`: This is important! Set this to the API (!) multiaddress of the deployed IPFS node (internal address, looks like `/ip4/127.0.0.1/tcp/5001`)
* `PINION_ORBIT_DB_DIR`: This will be the directory on the container which contains all of orbits pinned store data. It's set to `./orbitdb` by default which resolves to the relative position of the directory to the pinner one (`/pinion/orbitdb`) on the container.

### Dapp

tbd

Don't forget to add the `PINNER_ROOM` variable and to set the `PINNER_ID` to the `PeerID` of the IPFS node we are running.
