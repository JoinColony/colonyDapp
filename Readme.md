[![Greenkeeper badge](https://badges.greenkeeper.io/JoinColony/colonyDapp.svg?token=ab5cc1c9b3fffa7f098e11807727fd68e5811838df8b7240c9dbd1c54f424c48&ts=1510794087610)](https://greenkeeper.io/)

## Prerequisites
(for versions see package.json -> engines)
* Node.js
* Yarn

## Installation

Clone this repository :)

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

```
yarn run dev
```

Webpack dev server will be available under http://localhost:8080


## Testing

To run unit tests you have the following npm script:
```bash
yarn test
```

This will run the linter with the `--fix` enabled, check flow the flow types, and if all is well, it will run the `jest` test runner suite.
