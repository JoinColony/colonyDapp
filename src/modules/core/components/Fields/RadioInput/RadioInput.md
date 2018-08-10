### Radio Inputs

```jsx
const { Formik } = require('formik');
const radioChoices = ['foo', 'bar', 'baz'];
<Formik
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit, values }) => (
      <form onSubmit={handleSubmit}>
        <RadioInput
          checked={values.radioInput === 'basicRadio'}
          name="radioInput"
          label="Basic radio"
          value="basicRadio"
        />
        <RadioInput
          checked={values.radioInput === 'disabledRadio'}
          name="radioInput"
          label="Disabled radio"
          value="disabledRadio"
          disabled
        />
        <div style={{marginTop: '20px'}} />
        <RadioInput
          checked={values.radioInput === 'horizontal 1'}
          appearance={{ direction: 'horizontal' }}
          name="radioInput"
          label="Horizontal 1"
          value="horizontal 1"
        />
        <RadioInput
          checked={values.radioInput === 'horizontal 2'}
          appearance={{ direction: 'horizontal' }}
          name="radioInput"
          label="Horizontal 2"
          value="horizontal 2"
        />
        <div style={{marginTop: '20px'}} />
        <RadioInput
          checked={values.radioFakeCheckbox === 'fakeCheckbox'}
          appearance={{ theme: 'fakeCheckbox' }}
          name="radioFakeCheckbox"
          label="fakeCheckbox theme"
          value="fakeCheckbox"
        />
        <div style={{marginTop: '20px'}} />
        <RadioInput
          checked={values.radioColorPicker === 'colorPicker'}
          appearance={{ theme: 'colorPicker' }}
          name="radioColorPicker"
          label="And a colorPicker"
          radioStyle={{ backgroundColor: 'blue' }}
          value="blue"
        />
        <div style={{ marginTop: '20px' }} />
        <Button appearance={{ theme: 'primary' }} type="submit">And press me</Button>
      </form>
    )
  }
/>
```
