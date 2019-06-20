A list that shows token payouts of a task (or something else).

### Payout list with one line (+more)
```jsx
const BN = require('bn.js');
const moveDecimal = require('move-decimal-point');

const colonyTokens = [
  { address: '123', decimals: 18, name: 'Cool Token', symbol: 'COOL' },
  { address: '0x0', decimals: 18, name: 'Ether', symbol: 'ETH' },
  { address: '234', decimals: 18, name: 'Token Token', symbol: 'TKN' },
  { address: '345', decimals: 18, name: 'Twitch Token', symbol: 'TWCH' },
];

const payouts = [
  { token: '123', amount: new BN(moveDecimal('9200', 18)) },
  { token: '0x0', amount: new BN(moveDecimal('75000', 18)) },
  { token: '234', amount: new BN(moveDecimal('460000', 18)) },
  { token: '345', amount: new BN(moveDecimal('210000', 18)) },
];

const nativeToken = { address: '123' };

<div style={{ width: '80px' }}>
  <PayoutsList
    nativeToken={nativeToken}
    payouts={payouts}
    tokenOptions={colonyTokens}
  />
</div>
```

### Payout list with two (or more) lines (+more)
```jsx
const BN = require('bn.js');
const moveDecimal = require('move-decimal-point');

const colonyTokens = [
  { address: '123', decimals: 18, name: 'Cool Token', symbol: 'COOL' },
  { address: '0x0', decimals: 18, name: 'Ether', symbol: 'ETH' },
  { address: '234', decimals: 18, name: 'Token Token', symbol: 'TKN' },
  { address: '345', decimals: 18, name: 'Twitch Token', symbol: 'TWCH' },
];

const payouts = [
  { token: '123', amount: new BN(moveDecimal('9200', 18)) },
  { token: '0x0', amount: new BN(moveDecimal('75000', 18)) },
  { token: '234', amount: new BN(moveDecimal('460000', 18)) },
  { token: '345', amount: new BN(moveDecimal('210000', 18)) },
];

const nativeToken = { address: '123' };

<div style={{ width: '80px' }}>
  <PayoutsList
    maxLines={2}
    nativeToken={nativeToken}
    payouts={payouts}
    tokenOptions={colonyTokens}
  />
</div>
```
