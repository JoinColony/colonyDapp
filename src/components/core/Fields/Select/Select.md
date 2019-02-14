
### Basic Select Input

```jsx
const { Formik } = require('formik');
const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option three', value: 'three' },
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
        name="selectAltTheme"
      />
      <Button type="submit">Press Me</Button>
    </form>
  )}
/>
```

### Unconnected select input

```jsx
const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option three', value: 'three' },
];
initialState = { $value: ''};
<div style={{width: '120px'}}>
  <Select
    connect={false}
    // with connect={false}, `$value` and `setValue` are required
    $value={state.$value}
    setValue={val => setState({ $value: val })}
    appearance={{ alignOptions: 'right', theme: 'alt' }}
    elementOnly={true}
    label="I'm an unconnected Select" 
    options={options} 
    placeholder="Select"
    name="selectUnconnected"
  />
  <Button 
    onClick={() => {
      console.log(`Currenly chosen value: ${state.$value}`);
    }}
  >
    Press Me
  </Button>
</div>
```