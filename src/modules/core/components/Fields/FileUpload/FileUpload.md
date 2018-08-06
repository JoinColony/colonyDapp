### File upload

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
