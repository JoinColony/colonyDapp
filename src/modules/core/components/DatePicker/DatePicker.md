### DatePicker in Formik form

```tsx
import { Formik } from 'formik';

import Button from '../Button';

<Formik
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
</Formik>
```

### Unconnected DatePicker

For compatibility purposes the function which is called after a day is picked is passed through the `setValue` prop.

```tsx
import Button from '../Button';

<DatePicker
  closeOnDayPick
  connect={false}
  name="datepicker-unconnected"
  label="Pick a date"
  setValue={date => alert(date)}
  renderTrigger={
    ({ open, ref }) => (
      <Button innerRef={ref} onClick={open}>Click to pick!</Button>
    )}
  />
```
