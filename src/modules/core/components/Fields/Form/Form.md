A `Form` is a simple wrapper which includes a `Formik` container and the connected `<form>` element which already handles submit for you. You can basically just pass all the available `Formik` props into our `Form`, render your fields in there and be done with it.

The `children` of the form can be a render-prop (function), like in Formik or just a simple react-node.

For available `Formik` options see here: https://jaredpalmer.com/formik/docs/api/formik

### Form example

```js
import { FieldSet, Input, FormStatus } from '..';
import Button from '../../Button';

<Form onSubmit={values => alert(JSON.stringify(values))}>
  {({ status }) => (
    <div>
      <FieldSet>
        <Input connect={false} name="foo" label="A foo label" />
      </FieldSet>
      <FieldSet>
        <Button text="Cool" type="submit" />
      </FieldSet>
      <FormStatus status={status} />
    </div>
  )}
</Form>
```
