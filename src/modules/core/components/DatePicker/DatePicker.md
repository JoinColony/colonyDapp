### DatePicker in Formik form

```
import { Formik } from 'formik';
<Formik>
  <DatePicker name="datepicker" label="Pick a date" placeholder="Pick a date" />
</Formik>
```

### Unconnected DatePicker

For compatibility purposes the function which is called after a day is picked is passed through the `setValue` prop.

```
import Button from '../Button';

<DatePicker
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
