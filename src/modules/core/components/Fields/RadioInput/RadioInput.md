### Radio Input - default appearance (vertical)

```jsx
const radioChoices = ['foo', 'bar', 'baz'];
<div>
  {radioChoices.map(choice => (
    <RadioInput
      connect={false}
      key={`radio_default_${choice}`}
      label={choice}
      name="radioInputDefault"
      value={choice}
    />
  ))}
</div>
```

### Radio Input - horizontal appearance

```jsx
const radioChoices = ['foo', 'bar', 'baz'];
<div>
  {radioChoices.map(choice => (
    <RadioInput
      connect={false}
      key={`radio_horizontal_${choice}`}
      label={choice}
      name="radioInputHorizontal"
      value={choice}
    />
  ))}
</div>
```

# Radio Input with Formik

```jsx
const { Formik } = require('formik');
const radioChoices = ['foo', 'bar', 'baz'];
<Formik
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        {radioChoices.map(choice => (
          <RadioInput
            key={`radio_formik_${choice}`}
            label={choice}
            name="radioFormik"
            value={choice}
          />
        ))}
        <Button appearance={{ theme: 'primary' }} type="submit">And press me</Button>
      </form>
    )
  }
/>
```