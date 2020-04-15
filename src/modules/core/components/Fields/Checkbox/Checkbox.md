
### Checkboxes

```jsx
const { Form, Formik } = require('formik');
const checkboxOptions = [
  { label: 'Penguin', value: 'penguin' },
  { label: 'Giraffe', value: 'giraffe' },
  { label: 'Red Fox', value: 'redFox' },
];
<Formik
  initialValues={{ 'someCheckbox': [] }}
>
  {({ values }) => (
    <Form>
      {checkboxOptions.map(option => (
        <Checkbox
          name="someCheckbox"
          value={option.value}
          label={option.label}
          key={option.value}
        />
      ))}
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </Form>
  )}
</Formik>
```