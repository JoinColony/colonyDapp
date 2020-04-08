
### Basic Select Input

```jsx
import { Formik } from 'formik';
import Button from '../../Button';

const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option three', value: 'three' },
];
<Formik
  initialValues={{
    basicSelect: undefined,
    selectAltTheme: undefined,
  }}
  onSubmit={(values) => console.log(values)}
>
  {({ handleSubmit }) => (
    <form onSubmit={handleSubmit}>
      <Select
        label="I'm a Select"
        options={options}
        placeholder="Select an option"
        name="basicSelect"
      />
      <Select
        appearance={{ alignOptions: 'left', theme: 'alt', width: 'fluid' }}
        label="I'm an alt Select"
        options={options}
        placeholder="Select an alt option"
        name="selectAltTheme"
      />
      <Button type="submit">Press Me</Button>
    </form>
  )}
</Formik>
```

### Unconnected select input

```jsx
import { useState } from 'react';
import Button from '../../Button';

const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option three', value: 'three' },
];

const [currentValue, setCurrentValue] = useState();
<div style={{width: '120px'}}>
  <Select
    connect={false}
    // with connect={false}, `$value` and `setValue` are required
    $value={currentValue}
    setValue={val => setCurrentValue(val)}
    appearance={{ theme: 'alt', width: 'strict' }}
    elementOnly={true}
    label="I'm an unconnected Select"
    options={options}
    placeholder="Select"
    name="selectUnconnected"
  />
  <Button
    onClick={() => {
      console.log(`Currenly chosen value: ${currentValue}`);
    }}
  >
    Press Me
  </Button>
</div>
```
