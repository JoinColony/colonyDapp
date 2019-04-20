A list that shows token payouts of a task (or something else).

### Payout list with one line (+more)
```jsx
const BN = require('bn.js');

const payouts = [
  { token: { symbol: 'COOL' }, amount: new BN(92000) },
  { token: { symbol: 'ETH' }, amount: new BN(75000) },
  { token: { symbol: 'DAI' }, amount: new BN(460000) },
  { token: { symbol: 'CLNY' }, amount: new BN(210000) },
];

<div style={{ width: '80px' }}>
  <PayoutsList payouts={payouts} nativeToken="CLNY" />
</div>
```

### Payout list with two (or more) lines (+more)
```jsx
const BN = require('bn.js');

const payouts = [
  { token: { symbol: 'COOL' }, amount: new BN(92000) },
  { token: { symbol: 'ETH' }, amount: new BN(75000) },
  { token: { symbol: 'DAI' }, amount: new BN(460000) },
  { token: { symbol: 'CLNY' }, amount: new BN(210000) },
];

<div style={{ width: '80px' }}>
  <PayoutsList payouts={payouts} nativeToken="CLNY" maxLines={2} />
</div>
```
