## Example for Assignment Component

This example component deals with the display of a currently selected assignee for a task and it's funding options

### No Assignment or Funding set
```js
const Assignment = require('./Assignment.jsx').default;


<Assignment/>
```

### Pending Assignee
```js
const Assignment = require('./Assignment.jsx').default;

const Assignee = {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    username: 'Elena',
    displayName: 'Elena Dimitrova',
};
<Assignment assignee={Assignee} pending/>
```


### Assignee with Funding set
```js
const Assignment = require('./Assignment.jsx').default;

const assignee = {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    username: 'Elena',
    displayName: 'Elena Dimitrova',
};

const reputation =  19.5;
const payouts = [
    { symbol: 'COOL', amount: 600 },
    { symbol: 'ETH', amount: 200105 },
    { symbol: 'DAI', amount: 1001 },
    { symbol: 'CLNY', amount: 600 },
];

<Assignment assignee={assignee} payouts={payouts} reputation={reputation} />
```