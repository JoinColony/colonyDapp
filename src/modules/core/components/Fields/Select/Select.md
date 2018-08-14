
### Basic Select Input

```jsx
const { Formik } = require('formik');
const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
];
<Formik
  onSubmit={(values) => console.log(values)}
  render={({ handleSubmit }) => (
    <form onSubmit={handleSubmit}>
      <Select 
        label="I'm a Select" 
        options={options} 
        placeholder="Select an option"
        name="basicSelect1"
      />
      <Select
        appearance={{ alignOptions: 'right', theme: 'alt' }}
        label="I'm another Select" 
        options={options} 
        placeholder="Select another option"
        name="basicSelect2"
      />
      <Button type="submit">Press Me</Button>
    </form>
  )}
/>
```