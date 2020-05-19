### Textarea

```js
import { Form } from '../';

<Form initialValues={{ textarea: '' }}>
  <Textarea
    elementOnly
    name="textarea"
    placeholder="I am a textarea"
    label="Label"
  />
</Form>
```

### Textarea with rows

```js
import { Form } from '../';

<Form initialValues={{ textarea: '' }}>
  <Textarea
    rows="10"
    elementOnly
    name="textarea"
    placeholder="I have 10 rows"
    label="Label"
  />
</Form>
```

### Textarea with content

```js
import { Form } from '../';

const initialCopy = 'Ex cillum aute aute elit. Sint est ipsum in excepteur dolor. Non veniam sint do nulla exercitation amet aliquip ex officia. Exercitation minim non ad anim velit minim nisi eiusmod laboris do sit cupidatat sit. Officia do esse culpa amet aliqua aute enim fugiat deserunt dolor cupidatat esse nulla cillum. Est est voluptate Lorem aute laboris anim.';

<Form initialValues={{ textarea: initialCopy }}>
  <Textarea
    elementOnly
    name="textarea"
    placeholder="I am a textarea"
    label="Label"
  />
</Form>
```


### Textarea fat theme with content

```js
import { Form } from '../';

const initialCopy = 'Ex cillum aute aute elit. Sint est ipsum in excepteur dolor. Non veniam sint do nulla exercitation amet aliquip ex officia. Exercitation minim non ad anim velit minim nisi eiusmod laboris do sit cupidatat sit. Officia do esse culpa amet aliqua aute enim fugiat deserunt dolor cupidatat esse nulla cillum. Est est voluptate Lorem aute laboris anim.';

<Form initialValues={{ textarea: initialCopy }}>
  <Textarea
    elementOnly
    appearance={{ theme: 'fat' }}
    name="textarea"
    placeholder="I am a textarea"
    label="Label"
  />
</Form>
```

### Textarea with error

```js
import { Form } from '../';

<Form
  initialErrors={{ textarea: 'Must provide a value' }}
  initialValues={{ textarea: '' }}
  validate={() => ({ textarea: 'This value is rubbish!' })}
>
  <Textarea
    name="textarea"
    placeholder="Hover over me to see error"
    label="Label"
  />
</Form>
```

### Textarea with label

```js
import { Form } from '../';

<Form initialValues={{ textarea: '' }}>
  <Textarea
    name="textarea"
    placeholder="I have a label"
    label="Your personal Story"
  />
</Form>
```

### Textarea text with label and status

```js
import { Form } from '../';

<Form initialValues={{ textarea: '' }}>
  <Textarea
    name="textarea"
    placeholder="I have a status"
    label="Label"
    status="This status is looking good"
  />
</Form>
```

### Textarea text with label and extra node

```js
import { Form } from '../';

<Form initialValues={{ textarea: '' }}>
  <Textarea
    name="textarea"
    placeholder="I have an extra!"
    label="Look right ->"
    extra={<a href="#">I'm an extra node!</a>}
  />
</Form>
```

### Textarea with maximum length

```js
import { Form } from '../';

<Form initialValues={{ textarea: 'I have a maximum length!' }}>
  <Textarea
    name="textarea"
    label="Label"
    maxLength={90}
  />
</Form>
```

### Textarea resizable (only vertical!)

```js
import { Form } from '../';

<Form initialValues={{ textarea: '' }}>
  <Textarea
    appearance={{ resizable: 'vertical' }}
    name="textarea"
    placeholder="Resize me!"
  />
</Form>
```


### Textarea inline with rows and cols and resizable

```js
import { Form } from '../';

<Form initialValues={{ textarea: '' }}>
  <Textarea
    rows="10"
    cols="50"
    appearance={{ layout: 'inline', resizable: 'both' }}
    name="textarea"
    placeholder="I have 5 rows and 50 cols"
  />
</Form>
```


### Textarea with dark color schema

Looks great on dark backgrounds. This should also work for the fat theme.

```js
import { Form } from '../';

<Form initialValues={{ textarea: '' }}>
  <Textarea
    appearance={{ colorSchema: 'dark' }}
    name="textarea"
    placeholder="I'm dark!"
    label="Dark label"
  />
</Form>
```

### Textarea with transparent color schema

Uses the background color of its background (same for text). This should also work for the fat theme.

```js
import { Form } from '../';

<Form initialValues={{ textarea: '' }}>
  <Textarea
    appearance={{ colorSchema: 'transparent' }}
    name="textarea"
    placeholder="I'm a placeholder"
    label="Cool label"
  />
</Form>
```
