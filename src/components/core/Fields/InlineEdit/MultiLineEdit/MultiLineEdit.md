
### MultiLine Edit

```jsx
const { EditorState } = require('draft-js');
<Form
  initialValues={{
    multiLineEdit: EditorState.createEmpty(),
  }}
  onSubmit={({ multiLineEdit }) => {
    console.log('EditorState:', multiLineEdit);
    console.log('Plain text value:', multiLineEdit.getCurrentContent().getPlainText());
  }}
>
  <MultiLineEdit
    label="Multi Line Edit"
    name="multiLineEdit"
    placeholder="This is placeholder text for the MultiLineEdit component"
  />
  <Button type="submit">Submit</Button>
</Form>
```