
### Using BN instance

```jsx
const { parseEther } = require('ethers/utils');
const ethBalance = parseEther('1.555555555555555555');
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
