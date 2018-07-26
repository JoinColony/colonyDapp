Make users sort a mnemonic via drag & drop to prove that they have backed it up.

```js
const passphrase = 'cram object chronic analyst sadness tide gossip error snack boss immune extra';
<MnemonicDnDSorter
  connect={false}
  name="sortedpassphrase"
  label="Drag your phrase here"
  passphrase={passphrase}
  setValue={passphrase => alert(passphrase)}
/>
```
