
### Basic Select Input

```jsx
const { Formik } = require('formik');
const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
];
<Formik
  render={({ handleSubmit }) => (
    <form>
      <Select 
        label="I'm a Select" 
        options={options} 
        placeholder="Select an option"
        name="basicSelect"
      />
    </form>
  )}
/>
```