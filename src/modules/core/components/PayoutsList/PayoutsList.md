A list that shows token payouts of a task (or something else).

### Payout list with one line (+more)
```jsx
const BN = require('bn.js');

const payouts = [
  { token: { symbol: 'COOL' }, amount: new BN(92000) },
  { token: { symbol: 'ETH' }, amount: new BN(75000) },
  { token: { symbol: 'DAI' }, amount: new BN(460000) },
  { token: { address: '0x123', symbol: 'CLNY' }, amount: new BN(210000) },
];

const nativeToken = { address: '0x123' };

<div style={{ width: '80px' }}>
  <PayoutsList payouts={payouts} nativeToken={nativeToken} />
</div>
```

### Payout list with two (or more) lines (+more)
```jsx
const BN = require('bn.js');

const payouts = [
  { token: { symbol: 'COOL' }, amount: new BN(92000) },
  { token: { symbol: 'ETH' }, amount: new BN(75000) },
  { token: { symbol: 'DAI' }, amount: new BN(460000) },
  { token: { address: '0x123', symbol: 'CLNY' }, amount: new BN(210000) },
];

const nativeToken = { address: '0x123' };

<div style={{ width: '80px' }}>
  <PayoutsList payouts={payouts} nativeToken={nativeToken} maxLines={2} />
</div>
```
