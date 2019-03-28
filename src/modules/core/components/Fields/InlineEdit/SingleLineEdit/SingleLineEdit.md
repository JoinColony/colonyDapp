
### Single Line Editor

```jsx
import { Form } from '../..';

<Form>
  {({ values }) => (
    <div>
      <SingleLineEdit
        maxLength={300}
        name="singleLineEdit"
        placeholder="Click here to edit me"
      />
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </div>
  )}
</Form>
```
