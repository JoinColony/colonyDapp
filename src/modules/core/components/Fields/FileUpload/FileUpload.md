### File upload

```jsx
<FileUpload
  connect={false}
  name="fileUpload"
/>
```

### Upload multiple files

```jsx
const maxFilesLimit = 3;
<FileUpload
  connect={false}
  help={`Up to ${maxFilesLimit}`}
  label="Upload multiple files"
  maxFilesLimit={maxFilesLimit}
  name="fileUploadMultiple"
/>
```

### File upload only accept certain file types

```jsx
<FileUpload
  accept={['application/json']}
  connect={false}
  help=".json only"
  label="Type-limited file upload"
  name="fileUploadJson"
/>
```

### File upload with custom item component

```jsx
<FileUpload
  connect={false}
  itemComponent={props => {
    const { file, idx, remove } = props;
    return (
      <React.Fragment>
        <p>Image: {file.name}</p>
        <Button onClick={(evt) => {
          evt.stopPropagation();
          remove(idx);
        }}>
          Remove
        </Button>
      </React.Fragment>
    )
  }}
  name="fileUploadItemComponent"
  label="File upload with custom item component"
/>
```

### An upload form embedded in Formik

```js
const { Formik } = require('formik');
<Formik
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit }) => {
      return (
        <form onSubmit={handleSubmit}>
          <FileUpload 
            label="File upload with Formik" 
            name="fileUploadFormik"
          />
          <Button appearance={{ theme: 'primary' }} type="submit">And press me</Button>
        </form>
      )
    }
  }
/>
```