### Radio Inputs

```jsx
import { Formik } from 'formik';
import Heading from '../../Heading';
import Button from '../../Button';

const radioChoices = ['foo', 'bar', 'baz'];
<Formik
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit, values }) => (
      <form onSubmit={handleSubmit}>
        <Heading appearance={{ size: 'medium' }} text="Standard Radio" />
        {radioChoices.map(radioChoice => (
          <Radio
            checked={values.radioInput === radioChoice}
            key={radioChoice}
            label={radioChoice}
            name="radioInput"
            value={radioChoice}
          />
        ))}
        <div style={{marginTop: '20px'}} />
        <Heading appearance={{ size: 'medium' }} text="Disabled Radio" />
        <Radio
          checked={values.radioInputDisabled === 'radioInputDisabled'}
          disabled
          label="Disabled radio"
          name="radioInputDisabled"
          value="disabledRadio"
        />
        <div style={{marginTop: '20px'}} />
        <Heading appearance={{ size: 'medium' }} text="Horizontal Radio" />
        {radioChoices.map(radioChoice => (
          <Radio
            appearance={{ direction: 'horizontal' }}
            checked={values.radioHorizontal === radioChoice}
            key={radioChoice}
            label={radioChoice}
            name="radioHorizontal"
            value={radioChoice}
          />
        ))}
        <div style={{marginTop: '20px'}} />
        <Heading appearance={{ size: 'medium' }} text="Fake Checkbox Radio" />
        {radioChoices.map(radioChoice => (
          <Radio
            appearance={{ theme: 'fakeCheckbox' }}
            checked={values.radioFakeCheckbox === radioChoice}
            key={radioChoice}
            label={radioChoice}
            name="radioFakeCheckbox"
            value={radioChoice}
          />
        ))}
        <div style={{marginTop: '20px'}} />
        <Heading appearance={{ size: 'medium' }} text="Button Group Radio" />
        {radioChoices.map(radioChoice => (
          <Radio
            appearance={{ theme: 'buttonGroup' }}
            checked={values.radioButtonGroup === radioChoice}
            key={radioChoice}
            label={radioChoice}
            name="radioButtonGroup"
            value={radioChoice}
          />
        ))}
        <div style={{marginTop: '20px'}} />
        <Heading appearance={{ size: 'medium' }} text="Color Picker Radio" />
        <Radio
          checked={values.radioColorPicker === 'colorPicker'}
          appearance={{ theme: 'colorPicker' }}
          name="radioColorPicker"
          label="And a color field"
          radioStyle={{ backgroundColor: 'blue' }}
          value="blue"
          help="Note - This doesn't provide an actual colorpicker input. This is still just a radio input"
        />
        <div style={{ marginTop: '20px' }} />
        <Button appearance={{ theme: 'primary' }} type="submit">And press me</Button>
      </form>
    )
  }
/>
```
