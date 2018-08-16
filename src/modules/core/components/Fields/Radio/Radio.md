### Radio Inputs

```jsx
const { Formik } = require('formik');
const radioChoices = ['foo', 'bar', 'baz'];
<Formik
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit, values }) => (
      <form onSubmit={handleSubmit}>
        <Radio
          checked={values.radioInput === 'basicRadio'}
          name="radioInput"
          label="Basic radio"
          value="basicRadio"
        />
        <Radio
          checked={values.radioInput === 'disabledRadio'}
          name="radioInput"
          label="Disabled radio"
          value="disabledRadio"
          disabled
        />
        <div style={{marginTop: '20px'}} />
        <Radio
          checked={values.radioInput === 'horizontal 1'}
          appearance={{ direction: 'horizontal' }}
          name="radioInput"
          label="Horizontal 1"
          value="horizontal 1"
        />
        <Radio
          checked={values.radioInput === 'horizontal 2'}
          appearance={{ direction: 'horizontal' }}
          name="radioInput"
          label="Horizontal 2"
          value="horizontal 2"
        />
        <div style={{marginTop: '20px'}} />
        <Radio
          checked={values.radioFakeCheckbox === 'fakeCheckbox1'}
          appearance={{ theme: 'fakeCheckbox' }}
          name="radioFakeCheckbox"
          label="fakeCheckbox theme"
          value="fakeCheckbox1"
          help="This is actually a radio!"
        />
        <Radio
          checked={values.radioFakeCheckbox === 'fakeCheckbox2'}
          appearance={{ theme: 'fakeCheckbox' }}
          name="radioFakeCheckbox"
          label="Another fakeCheckbox theme"
          value="fakeCheckbox2"
          help="This is a radio too!"
        />
        <div style={{marginTop: '20px'}} />
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
