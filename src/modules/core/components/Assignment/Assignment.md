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

const BN = require('bn.js');
const assignee = {
  profile: {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    username: 'Elena',
    displayName: 'Elena Dimitrova',
  }
};

const reputation =  19.5;
const payouts = [
  { token: { symbol: 'COOL' }, amount: new BN(92000) },
  { token: { symbol: 'ETH' }, amount: new BN(75000) },
  { token: { symbol: 'DAI' }, amount: new BN(460000) },
  { token: { address: '0x123', symbol: 'CLNY' }, amount: new BN(210000) },
];

const nativeToken = { address: '0x123' };

<Assignment nativeToken={nativeToken} assignee={assignee} payouts={payouts} reputation={reputation} renderAvatar={renderAvatar} />
```
