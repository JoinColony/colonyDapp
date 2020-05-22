### DatePicker in Formik form

```tsx
import { Form } from '../Fields';
import Button from '../Button';

<Form
  initialValues={{ datepicker: undefined }}
  onSubmit={(values) => console.log(values)}
>
  {({ values }) => (
    <>
      <DatePicker name="datepicker" label="Pick a date" placeholder="Pick a date" />
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <br />
      <Button type="submit">Submit</Button>
    </>
  )}
</Form>
```

### DatePicker with custom `renderTrigger`

```tsx
import { Form } from '../Fields';
import Button from '../Button';

<Form
  initialValues={{ datepicker: undefined }}
  onSubmit={(values) => console.log(values)}
>
  {({ values: { datepicker } }) => (
    <DatePicker
      closeOnDayPick
      name="datepicker"
      label="Pick a date"
      renderTrigger={
        ({ open, ref }) => (
          <>
            <Button innerRef={ref} onClick={open}>Click to pick!</Button>
            {datepicker && (
              <p>{datepicker.toString()}</p>
            )}
          </>
        )}
      />
  )}
</Form>
```
