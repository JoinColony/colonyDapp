[![Greenkeeper badge](https://badges.greenkeeper.io/JoinColony/colonyDapp.svg?token=ab5cc1c9b3fffa7f098e11807727fd68e5811838df8b7240c9dbd1c54f424c48&ts=1510794087610)](https://greenkeeper.io/)

## Prerequisites
(for versions see package.json -> engines)
* Node.js
* Yarn

## Installation

Clone this repository :)

### Provision dependent libraries

This project depends on external libraries so after cloning, they need to be provisioned:
```bash
yarn provision
```

Under the hood, this will initialized the `submodule`s install they're packages and build them

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

Webpack dev server will be available under http://localhost:8080

## Building the bundle locally

If you want to build the bundle locally for inspection, you can do it via:
```bash
yarn build
````

_Note: It's a strait-up dev build. Just bundled, no code optimizations what so ever._

## Linting

Linting your code via `eslint` can be done as such:
```bash
yarn lint
```

## Type checking

Type checking using `flow` can be accessed using this npm script:
```bash
yarn flow
```

## Testing

To run unit tests you have the following npm script:

```bash
yarn test:unit
```
