# Colony Dapp

## Prerequisites
* Node.js (Best use [nvm](https://github.com/nvm-sh/nvm))

## Installation

First, clone this repository :)

### Install packages

Pick the right node version (as seen in `.nvmrc`):

```bash
nvm use
```

Install all dependencies:

```bash
npm install
```

### Provision dependent libraries

This project depends on external libraries, so after cloning, they need to be provisioned:
```bash
npm run provision
```

Under the hood, this will initialize the `submodule`s, install their packages, and build them. Furthermore this will create the SSL certificate needed to run the dev server

### Define environment variables

The provision step will set up a `.env` file for you. It should work right out of the bat. If needed, customize the variables in the `.env` file to your desires.

Also take a look at the `src/lib/colonyServer/.env` file that the provision script created. As with the one in the root, it should work just fine for most cases.

## Running the dev environment

```bash
npm run dev
```

This will run the _whole stack_ which starts `ganache`, deploys the contracts, starts a database instance as well as the server and `webpack`.

**The webpack dev server will be available under `http://localhost:9090`.**

You can run some of these individually using the following commands:

```
npm run ganache
npm run contracts:deploy
npm run webpack
```

When run individually, some processes might need an own terminal window.

You can also run the whole stack and skip some commands, e.g.:

```bash
npm run dev --skip-webpack
```

Then run `webpack` individually, if you like:

```bash
npm run webpack
```

Like this you could restart the `webpack` process in cases of hiccups without restarting the whole stack (that happens!)


### Verbose logging

Set the environment variable `VERBOSE` to `true` to enable verbose mode logging in the browser console.

If you're brave enough to set the `DEBUG` environment variable, you'll get a lot of logging from modules we're using (e.g. IPFS). To disable this, you'll need to unset the environment variable and then run this in the browser console: `localStorage.setItem('debug', undefined);`.


## Building the bundle locally

If you want to build the bundle locally for inspection, you can do it via:
```bash
npm run webpack:build
````

_Note: It's a straight-up dev build. Just bundled, no code optimizations whatsoever._

## Linting

Linting your code via `eslint` can be done as such:
```bash
npm run lint
```

To lint the project's style sheets you run:
```bash
npm run stylelint
```

## Type checking

Type checking using TypeScript can be accessed using this npm script:
```bash
npm run typecheck

# Or, with file watching (or any other `tsc optional arguments`)
npm run typecheck --watch
```

## Testing

To run unit tests you have the following npm script:

```bash
npm run test
```
