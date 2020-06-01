
### Basic Select Input

```jsx
import { Form } from '..';
import Button from '../../Button';

const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option three', value: 'three' },
];
<Form
  initialValues={{ basicSelect: undefined, selectAltTheme: undefined }}
  onSubmit={values => console.log(values)}
>
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
</Form>
```
