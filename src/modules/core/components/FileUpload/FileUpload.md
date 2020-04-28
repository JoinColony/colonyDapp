### FileUpload

```js
import { Formik } from 'formik';
import Button from '../Button';

<Formik
  initialValues={{
    fileUploadFormik: undefined,
  }}
  onSubmit={values => console.log(values)}
>
  {({ handleSubmit, isValid }) => (
    <form onSubmit={handleSubmit}>
      <FileUpload
        accept={['application/json',]}
        label="File upload with Formik"
        maxFilesLimit={4}
        name="fileUploadFormik"
        upload={() => 'uploaded!'}
      />
      <Button appearance={{ theme: 'primary' }} disabled={!isValid} type="submit">And press me</Button>
    </form>
  )}
</Formik>
```

### FileUpload with `extra` node

```js
import { Formik } from 'formik';
import Button from '../Button';

<Formik
  initialValues={{
    fileUpload: undefined,
  }}
  onSubmit={values => console.log(values)}
>
  {({ handleSubmit, isValid }) => (
    <form onSubmit={handleSubmit}>
      <FileUpload
        accept={['application/json',]}
        label="File upload"
        name="fileUpload"
        extra={<span>Wink! Wink!</span>}
        upload={() => 'uploaded!'}
      />
      <Button appearance={{ theme: 'primary' }} disabled={!isValid} type="submit">Upload everything!</Button>
    </form>
  )}
</Formik>
```
