[![Greenkeeper badge](https://badges.greenkeeper.io/JoinColony/colonyDapp.svg?token=ab5cc1c9b3fffa7f098e11807727fd68e5811838df8b7240c9dbd1c54f424c48&ts=1510794087610)](https://greenkeeper.io/)

## Prerequisites
(for versions see package.json -> engines)
* Node.js
* Yarn

## Installation
Clone this repository

```
git submodule update --init --recursive
yarn && cd colonyNetwork && yarn
```

## Define environment variables

Firstly copy the example env file:

```bash
cp .env.example .env
```

Then customise the variables in the .env file to your needs.

When adding a new environment variable, you must add it to both files
(otherwise, the `dotenv-webpack` plugin will throw an error); this is
designed to keep the expected environment defined in a simple way.

To use the environment variables in the dApp:

```JavaScript
const { MY_API_URL } = process.env;
console.log(MY_API_URL); // https://my-api-url.example.com/api
```

## Running dev environment

```
yarn start dev
```

Webpack dev server will be available under http://localhost:8080
