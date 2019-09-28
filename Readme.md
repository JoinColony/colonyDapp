# Colony Dapp

## Prerequisites
(for versions see package.json -> engines)
* A running docker daemon
* Node.js
* Yarn
* [mkcert](https://github.com/FiloSottile/mkcert) (for self-signed SSL certificates)

## Installation

Clone this repository :)

### Setup docker

We use docker for:

- Compiling the Solidity smart contracts
- Running an IPFS node for the pinning service

- You need to install docker on your machine, see the [documentation](https://docs.docker.com/install/#supported-platforms) for installation instructions.
- We also assume docker is accessible as a non-root user, remember to complete the [post-install instructions](https://docs.docker.com/install/linux/linux-postinstall/) on linux.

### Setup self-signed certificates for HTTPS

Various new browser technologies require the dev environment to be run via https. For that we need self-signed certificates for the domain you run the dApp in dev mode (most likely `localhost` or `127.0.0.1`). We also can't just use "untrusted" self-signed certificates as IPFS won't run using those via secure websockets.

So we're using the great [mkcert](https://github.com/FiloSottile/mkcert) tool:

1) Install mkcert using the instructions in their [readme](https://github.com/FiloSottile/mkcert#installation) (mind the note regarding Firefox!)
2) Install the root CA certificate: `mkcert -install`

Move on to the `provision` step. The needed certificates and corresponding keys will be generated automatically.

If you don't want to do a full provision you can also execute the following command (from the root repo directory):
```
mkdir -p ssl && cd ssl && mkcert localhost 127.0.0.1 ::1
```

This will create the certificate files needed.

### Provision dependent libraries

This project depends on external libraries, so after cloning, they need to be provisioned:
```bash
yarn provision
```

Under the hood, this will initialize the `submodule`s, install their packages, and build them. Furthermore this will create the SSL certificate needed to run the dev server

### Install packages

```bash
yarn
```

### Define environment variables

Firstly copy the example env file:
```bash
cp .env.example .env
```

Then customize the variables in the `.env` file to your needs.

When adding a new environment variable, you must add it to both files _(otherwise, the `dotenv-webpack` plugin will throw an error)_; this is designed to keep the expected environment defined in a simple way.

To use the environment variables in the dApp:

```js
const { MY_API_URL } = process.env;
console.log(MY_API_URL); // https://my-api-url.example.com/api
```

## Running dev environment

```bash
yarn dev
```

This will run the _whole stack_ which starts `ganache`, deploys the contracts, starts `trufflepig` and `webpack`. The webpack dev server will be available under `https://localhost:9090` (mind the `s` after `http`!)

You can run these individually using the following commands:

```
yarn ganache
yarn contracts:deploy
yarn trufflepig
yarn webpack
```

### Verbose logging

Set the environment variable `VERBOSE` to `true` to enable verbose mode logging in the browser console.

If you're brave enough to set the `DEBUG` environment variable, you'll get a lot of logging from modules we're using (e.g. IPFS). To disable this, you'll need to unset the environment variable and then run this in the browser console: `localStorage.setItem('debug', undefined);`.


## Building the bundle locally

If you want to build the bundle locally for inspection, you can do it via:
```bash
yarn webpack:build
````

_Note: It's a straight-up dev build. Just bundled, no code optimizations whatsoever._

## Linting

Linting your code via `eslint` can be done as such:
```bash
yarn lint
```

To lint the project's style sheets you run:
```bash
yarn stylelint
```

## Type checking

Type checking using TypeScript can be accessed using this npm script:
```bash
yarn typecheck

# Or, with file watching (or any other `tsc optional arguments`)
yarn typecheck --watch
```

## Testing

To run unit tests you have the following npm script:

```bash
yarn test
```
