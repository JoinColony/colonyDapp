
### Using BN instance

```jsx
const { toWei } = require('ethjs-unit');
const ethBalance = toWei('1.555555555555555555', 'ether');
<EthUsd value={ethBalance} decimals={15} />
```

### Using primitive `number`

```jsx
<EthUsd value={1.555555555555555555} decimals={15} />
```

### Using primitive 'string'

```jsx
<EthUsd value={'1.555555555555555555'} decimals={15} />
```