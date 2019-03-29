## Example for Assignment Component

This example component deals with the display of a currently selected assignee for a task and it's funding options

### No Assignment or Funding set
```js
const renderAvatar = () => null;

<Assignment renderAvatar={renderAvatar} />
```

### Pending Assignee
```js
const renderAvatar = () => null;

const Assignee = {
  profile: {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    username: 'Elena',
    displayName: 'Elena Dimitrova',
  }
};
<Assignment assignee={Assignee} pending renderAvatar={renderAvatar} />
```


### Assignee with Funding set
```js
const renderAvatar = () => null;

const { List } = require('immutable');
const BN = require('bn.js');
const { TaskPayoutRecord } = require('~immutable');
const assignee = {
  profile: {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    username: 'Elena',
    displayName: 'Elena Dimitrova',
  }
};

const reputation =  19.5;
const payouts = List.of(
  TaskPayoutRecord({ token: { symbol: 'COOL' }, amount: new BN(60000) }),
  TaskPayoutRecord({ token: { symbol: 'ETH' }, amount: new BN(200105) }),
  TaskPayoutRecord({ token: { symbol: 'DAI' }, amount: new BN(1001) }),
  TaskPayoutRecord({ token: { symbol: 'CLNY' }, amount: new BN(60000) }),
);

<Assignment nativeToken="CLNY" assignee={assignee} payouts={payouts} reputation={reputation} renderAvatar={renderAvatar} />
```
