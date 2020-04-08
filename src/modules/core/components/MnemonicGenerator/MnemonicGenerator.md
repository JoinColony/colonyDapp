A component to generate a mnemonic (passphrase) which serves as a wallet backup.

```js
const { shuffle } = require('../../../../utils/arrays');
const { Formik } = require('formik');
<Formik
  initialValues={{
    mnemonic: undefined,
    onSubmit: (values) => console.log(values),
  }}
>
  <MnemonicGenerator
    name="mnemonic"
    generateFn={() => shuffle(['top', 'hip', 'hop', 'foo', 'bar', 'bzz', 'yup']).join(' ')}
  />
</Formik>
```
