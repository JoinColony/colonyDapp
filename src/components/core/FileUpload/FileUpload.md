### FileUpload

```js
const { Formik } = require('formik');
<Formik
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit, isValid }) => (
      <form onSubmit={handleSubmit}>
        <FileUpload
          accept={['application/json',]}
          label="File upload with Formik"
          name="fileUploadFormik"
        />
        <Button appearance={{ theme: 'primary' }} disabled={!isValid} type="submit">And press me</Button>
      </form>
    )
  }
/>
```

### FileUpload with `extra` node

```js
const { Formik } = require('formik');
<Formik
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit, isValid }) => (
      <form onSubmit={handleSubmit}>
        <FileUpload
          accept={['application/json',]}
          label="File upload"
          name="fileUpload"
          extra={<span>Wink! Wink!</span>}
        />
        <Button appearance={{ theme: 'primary' }} disabled={!isValid} type="submit">Upload everything!</Button>
      </form>
    )
  }
/>
```
