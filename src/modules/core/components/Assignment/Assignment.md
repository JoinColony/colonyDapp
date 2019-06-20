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
const moveDecimal = require('move-decimal-point');

const assignee = {
  profile: {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    username: 'Elena',
    displayName: 'Elena Dimitrova',
  }
};

const reputation =  19.5;

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

<Assignment
  assignee={assignee}
  nativeToken={nativeToken}
  payouts={payouts}
  renderAvatar={renderAvatar}
  reputation={reputation}
  tokenOptions={colonyTokens}
/>
```
