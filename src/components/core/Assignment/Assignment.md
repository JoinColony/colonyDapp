## Example for Assignment Component

This example component deals with the display of a currently selected assignee for a task and it's funding options

### No Assignment or Funding set
```js
<Assignment/>
```

### Pending Assignee
```js
const Assignee = {
  profile: {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    username: 'Elena',
    displayName: 'Elena Dimitrova',
  }
};
<Assignment assignee={Assignee} pending/>
```


### Assignee with Funding set
```js
const { List } = require('immutable');
const BN = require('bn.js');
const { TaskPayout } = require('~immutable');
const assignee = {
  profile: {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    username: 'Elena',
    displayName: 'Elena Dimitrova',
  }
};

const reputation =  19.5;
const payouts = List.of(
  TaskPayout({ token: { symbol: 'COOL' }, amount: new BN(60000) }),
  TaskPayout({ token: { symbol: 'ETH' }, amount: new BN(200105) }),
  TaskPayout({ token: { symbol: 'DAI' }, amount: new BN(1001) }),
  TaskPayout({ token: { symbol: 'CLNY' }, amount: new BN(60000) }),
);

<Assignment nativeToken="CLNY" assignee={assignee} payouts={payouts} reputation={reputation} />
```
