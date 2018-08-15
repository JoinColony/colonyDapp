
### Basic Select Input

```jsx
const { Formik } = require('formik');
const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 'three' },
];
<Formik
  onSubmit={(values) => console.log(values)}
  render={({ handleSubmit }) => (
    <form onSubmit={handleSubmit}>
      <Select 
        label="I'm a Select" 
        options={options} 
        placeholder="Select an option"
        name="basicSelect"
      />
      <Select
        appearance={{ alignOptions: 'left', theme: 'alt' }}
        label="I'm an alt Select" 
        options={options} 
        placeholder="Select an alt option"
        name="selecdtAltTheme"
      />
      <Button type="submit">Press Me</Button>
    </form>
  )}
/>
```