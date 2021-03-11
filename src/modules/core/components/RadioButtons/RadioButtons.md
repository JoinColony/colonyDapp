
## Radio Buttons

```jsx
const { Form, Formik } = require('formik');

const options = [
  {
    value: "motion",
    label: "Motion",
    disabled: true,
    description: "Fully staked",
    appearance: {
      theme: "primary"
    }
  },
  {
    value: "objection",
    label: "Objection",
    description: "100% of 100.00 CLNY",
    appearance: {
      theme: "danger"
    }
  }
]
<Formik onSubmit={() => {}} initialValues={{ 'test': null }}>
  {({ values }) => (
    <RadioButtons options={options} currentlyCheckedValue={values.test} name="test" />
  )}
</Formik>
```
