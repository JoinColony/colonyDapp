### Radio Input

```jsx
const { Formik } = require('formik');
const radioChoices = ['foo', 'bar', 'baz'];
<Formik
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit, values }) => (
      <form onSubmit={handleSubmit}>
        {radioChoices.map(choice => (
          <RadioInput
            key={`radio_input_${choice}`}
            checked={values.radioInput === choice}
            label={choice}
            name="radioInput"
            value={choice}
          />
        ))}
        <Button appearance={{ theme: 'primary' }} type="submit">And press me</Button>
      </form>
    )
  }
/>
```

### Radio Input horizontal

```jsx
const { Formik } = require('formik');
const radioChoices = ['foo', 'bar', 'baz'];
<Formik
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit, values }) => (
      <form onSubmit={handleSubmit}>
        {radioChoices.map(choice => (
          <RadioInput
            appearance={{ direction: 'horizontal' }}
            key={`radio_input_horizontal_${choice}`}
            checked={values.radioInputHorizontal === choice}
            label={choice}
            name="radioInputHorizontal"
            value={choice}
          />
        ))}
        <div>
          <Button appearance={{ theme: 'primary' }} type="submit">And press me</Button>
        </div>
      </form>
    )
  }
/>
```

### Radio Input with Children

```jsx
const { Formik } = require('formik');
const radioChoices = [
  {value: 'foo', otherValue: 'oof'},
  {value: 'bar', otherValue: 'rab'},
  {value: 'baz', otherValue: 'zab'},
];
<Formik
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit, values }) => (
      <form onSubmit={handleSubmit}>  
        {radioChoices.map(choice => (
          <RadioInput
            checked={values.radioInputChildren === choice.value}
            key={`radio_input_children_${choice.value}`}
            name="radioInputChildren"
            value={choice.value}
            children={`${choice.value} - radio child - ${choice.otherValue}`}
          />
        ))}
        <div>
          <Button appearance={{ theme: 'primary' }} type="submit">And press me</Button>
        </div>
      </form>
    )
  }
/>
```

