A list that shows token payouts of a task (or something else).

### Payout list with one line (+more)
```jsx
const { List } = require('immutable');
const BN = require('bn.js');
const { TaskPayout } = require('~immutable');

const payouts = List.of(
  TaskPayout({ token: { symbol: 'COOL' }, amount: new BN(92000) }),
  TaskPayout({ token: { symbol: 'ETH' }, amount: new BN(75000) }),
  TaskPayout({ token: { symbol: 'DAI' }, amount: new BN(460000) }),
  TaskPayout({ token: { symbol: 'CLNY' }, amount: new BN(210000) }),
);

<div style={{ width: '80px' }}>
  <PayoutsList payouts={payouts} nativeToken="CLNY" />
</div>
```

### Payout list with two (or more) lines (+more)
```jsx
const { List } = require('immutable');
const BN = require('bn.js');
const { TaskPayout } = require('~immutable');

const payouts = List.of(
  TaskPayout({ token: { symbol: 'COOL' }, amount: new BN(92000) }),
  TaskPayout({ token: { symbol: 'ETH' }, amount: new BN(75000) }),
  TaskPayout({ token: { symbol: 'DAI' }, amount: new BN(460000) }),
  TaskPayout({ token: { symbol: 'CLNY' }, amount: new BN(210000) }),
);

<div style={{ width: '80px' }}>
  <PayoutsList payouts={payouts} nativeToken="CLNY" maxLines={2} />
</div>
```
