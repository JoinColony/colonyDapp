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

const { bigNumberify } = require('ethers/utils');
const moveDecimal = require('move-decimal-point');

const assignee = {
  profile: {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    username: 'Elena',
    displayName: 'Elena Dimitrova',
  }
};

const reputation =  19.5;

const nativeTokenAddress = '123';

const payouts = [
  {
    tokenAddress: nativeTokenAddress,
    amount: bigNumberify(moveDecimal('9200', 18)),
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
    amount: bigNumberify(moveDecimal('7500', 18)),
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
    amount: bigNumberify(moveDecimal('46000', 18)),
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
    amount: bigNumberify(moveDecimal('210000', 18)),
    token: {
      id: '345',
      address: '345',
      decimals: 18,
      name: 'Twitch Token',
      symbol: 'TWCH',
    },
  },
];

<Assignment
  assignee={assignee}
  nativeTokenAddress={nativeTokenAddress}
  payouts={payouts}
  reputation={reputation}
/>
```
