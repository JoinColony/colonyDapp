A component to generate a mnemonic (passphrase) which serves as a wallet backup.

```js
const { shuffle } = require('../../../../utils/arrays');
const { Formik } = require('formik');
<Formik>
  <MnemonicGenerator
    name="mnemonic"
    generateFn={() => shuffle(['top', 'hip', 'hop', 'foo', 'bar', 'bzz', 'yup']).join(' ')}
  />
</Formik>
```
