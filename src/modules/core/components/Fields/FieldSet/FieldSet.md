A `<FieldSet>` is a simple html fieldset element with special styles applied. You can use it to separate groups of Form elements visually or wrap a group of horizontal buttons in it.

### FieldSet example

```js
import { Input } from '..';
import Button from '../../Button';

<div>
  <Input name="fieldsetinput" connect={false} label="Field next to fieldset" />
  <FieldSet>
    <Button text="Cool" />
    <Button appearance={{ theme: 'danger' }} text="Cool other button" />
  </FieldSet>
</div>
```
### Fieldset aligned to the right

```js
import Button from '../../Button';

<FieldSet appearance={{ align: 'right' }}>
  <Button text="Cool" />
  <Button appearance={{ theme: 'danger' }} text="Cool other button" />
</FieldSet>
```

