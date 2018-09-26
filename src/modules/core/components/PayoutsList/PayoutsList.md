A list that shows token payouts of a task (or something else).

### Payout list with one line (+more)
```
const payouts = [
  { symbol: 'COOL', amount: 9200000000000000000 },
  { symbol: 'ETH', amount: 750000000000000000 },
  { symbol: 'DAI', amount: 4600000000000000000 },
  { symbol: 'CLNY', amount: 2100000000000000000 },
];

<div style={{ width: '80px' }}>
  <PayoutsList payouts={payouts} nativeToken="CLNY" />
</div>
```

### Payout list with two (or more) lines (+more)
```
const payouts = [
  { symbol: 'COOL', amount: 9200000000000000000 },
  { symbol: 'ETH', amount: 750000000000000000 },
  { symbol: 'DAI', amount: 4600000000000000000 },
  { symbol: 'CLNY', amount: 2100000000000000000 },
];

<div style={{ width: '80px' }}>
  <PayoutsList payouts={payouts} nativeToken="CLNY" maxLines={2} />
</div>
```
