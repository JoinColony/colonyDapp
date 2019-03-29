
## Radio Group

A quick way to build a radio field by providing an array of choices.

```jsx
import { Form } from '..';
import Heading from '../../Heading';
import Button from '../../Button';

const radioChoices = [
  { label: 'Foo', value: 'foo' },
  { label: 'Bar', value: 'bar' },
  { label: 'Baz', value: 'baz' },
  { label: 'Disabled', value: 'disabled', disabled: true },
  { label: 'With Help Text', value: 'help text', help: 'This is the help text' },
  { label: 'With Custom Children', value: 'custom children', children: <h2>Children</h2> }
];
<Form
  initialValues={{
    radioGroup: radioChoices[0].value,
    radioGroupHorizontal: radioChoices[0].value,
    radioGroupButtons: radioChoices[0].value,
  }}
  onSubmit={console.log}
>
  {({ values: { radioGroup, radioGroupHorizontal, radioGroupButtons }}) => (
    <div>
      <Heading appearance={{ size: 'medium' }} text="Basic Radio Group" />
      <RadioGroup
        options={radioChoices}
        name="radioGroup"
        currentlyCheckedValue={radioGroup}
      />
      <Heading appearance={{ size: 'medium' }} text="Horizontal Radio Group" />
      <RadioGroup
        appearance={{ direction: 'horizontal' }}
        options={radioChoices}
        name="radioGroupHorizontal"
        currentlyCheckedValue={radioGroupHorizontal}
      />
      <Heading appearance={{ size: 'medium' }} text="Radio Group Buttons" />
      <RadioGroup
        appearance={{ theme: 'buttonGroup' }}
        options={radioChoices}
        name="radioGroupButtons"
        currentlyCheckedValue={radioGroupButtons}
      />
      <Button type="submit" text="Submit" />
    </div>
  )}
</Form>
```
