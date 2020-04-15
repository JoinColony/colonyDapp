A list that shows token payouts of a task (or something else).

### Payout list with one line (+more)
```jsx
const BN = require('bn.js');
const moveDecimal = require('move-decimal-point');

const nativeTokenAddress = '123';

const payouts = [
  {
    tokenAddress: nativeTokenAddress,
    amount: new BN(moveDecimal('9200', 18)),
    token: {
      id: nativeTokenAddress,
      address: nativeTokenAddress,
      decimals: 18,
      name: 'Cool Token',
      symbol: 'COOL',
    },
  },
  {
    tokenAddress: '0x0',
    amount: new BN(moveDecimal('7500', 18)),
    token: {
      id: '0x0',
      address: '0x0',
      decimals: 18,
      name: 'Ether',
      symbol: 'Eth',
    },
  },
  {
    tokenAddress: '234',
    amount: new BN(moveDecimal('46000', 18)),
    token: {
      id: '234',
      address: '234',
      decimals: 18,
      name: 'Another Token',
      symbol: 'ANTT',
    },
  },
  {
    tokenAddress: '345',
    amount: new BN(moveDecimal('210000', 18)),
    token: {
      id: '345',
      address: '345',
      decimals: 18,
      name: 'Twitch Token',
      symbol: 'TWCH',
    },
  },
];

<div style={{ width: '80px' }}>
  <PayoutsList
    nativeTokenAddress={nativeTokenAddress}
    payouts={payouts}
  />
</div>
```

### Payout list with two (or more) lines (+more)
```jsx
const BN = require('bn.js');
const moveDecimal = require('move-decimal-point');

const nativeTokenAddress = '123';

const payouts = [
  {
    tokenAddress: nativeTokenAddress,
    amount: new BN(moveDecimal('9200', 18)),
    token: {
      id: nativeTokenAddress,
      address: nativeTokenAddress,
      decimals: 18,
      name: 'Cool Token',
      symbol: 'COOL',
    },
  },
  {
    tokenAddress: '0x0',
    amount: new BN(moveDecimal('7500', 18)),
    token: {
      id: '0x0',
      address: '0x0',
      decimals: 18,
      name: 'Ether',
      symbol: 'Eth',
    },
  },
  {
    tokenAddress: '234',
    amount: new BN(moveDecimal('46000', 18)),
    token: {
      id: '234',
      address: '234',
      decimals: 18,
      name: 'Another Token',
      symbol: 'ANTT',
    },
  },
  {
    tokenAddress: '345',
    amount: new BN(moveDecimal('210000', 18)),
    token: {
      id: '345',
      address: '345',
      decimals: 18,
      name: 'Twitch Token',
      symbol: 'TWCH',
    },
  },
];

<div style={{ width: '80px' }}>
  <PayoutsList
    maxLines={2}
    nativeTokenAddress={nativeTokenAddress}
    payouts={payouts}
  />
</div>
```
