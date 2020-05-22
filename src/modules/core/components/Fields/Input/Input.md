### Input text

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    elementOnly
    name="input"
    placeholder="I'm an input"
    label="Label"
  />
</Form>
```

### Input text with error

```js
import { Form } from '../';

<Form
  initialValues={{ input: '' }}
  initialErrors={{ input: 'Wrong!' }}
  touched={{ input: true }}
  validate={{ input: 'Wrong!' }}  
>
  <Input
    elementOnly
    name="input"
    placeholder="I have an error"
    label="Label"
  />
</Form>
```

### Input text with label

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    name="input"
    placeholder="I have a label"
    label="Your details"
  />
</Form>
```

### Input text aligned right

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    appearance={{ align: 'right' }}
    name="input"
    placeholder="I'm on the right side!"
    label="You came to the right place"
  />
</Form>
```

### Input text with label and error

```js
import { Form } from '../';

<Form
  initialValues={{ input: '' }}
  initialErrors={{ input: 'Wrong!' }}
  touched={{ input: true }}
  validate={{ input: 'Wrong!' }}  
>
  <Input
    name="input"
    placeholder="I'm wrong as well!"
    label="Label"
  />
</Form>
```

### Input text with label and status

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    name="input"
    placeholder="I have a custom status!"
    label="Look!"
    status="This is all good now"
  />
</Form>
```

### Input text with label and extra node

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    name="input"
    placeholder="I have an extra node!"
    label="Look right ->"
    extra={<a href="#">I'm an extra node!</a>}
  />
</Form>
```

### Input text with horizontal label

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    appearance={{ direction: 'horizontal' }}
    name="input"
    placeholder="I'm horizontal!"
    label="Label"
  />
</Form>
```

### Input text with horizontal label and error

```js
import { Form } from '../';

<Form
  initialValues={{ input: '' }}
  initialErrors={{ input: 'Wrong!' }}
  touched={{ input: true }}
  validate={{ input: 'Wrong!' }}  
>
  <Input
    appearance={{ direction: 'horizontal' }}
    name="input"
    placeholder="I'm horizontal and wrong!"
    label="Label"
  />
</Form>
```

### Input with dark color schema

Looks great on dark backgrounds. This should also work for the fat theme.

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    appearance={{ colorSchema: 'dark' }}
    name="input"
    placeholder="I'm dark!"
    label="Dark label" 
  />
</Form>
```

### Input with transparent color schema

Uses the background color of its background (same for text). This should also work for the fat theme.

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    appearance={{ colorSchema: 'transparent' }}
    name="input"
    placeholder="I'm a placeholder"
    label="Cool label"
  />
</Form>
```

### Fat input field

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    appearance={{ theme: 'fat' }}
    name="input"
    placeholder="I'm fat"
    label="Fat label"
  />
</Form>
```

### Underlined theme

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    appearance={{ theme: 'underlined', direction: 'horizontal' }}
    name="input"
    placeholder="I'm underlined"
    label="A label"
  />
</Form>
```

### Underlined theme error

```js
import { Form } from '../';

<Form
  initialValues={{ input: '' }}
  initialErrors={{ input: 'Wrong!' }}
  touched={{ input: true }}
  validate={{ input: 'Wrong!' }}  
>
  <Input
    appearance={{ theme: 'underlined', direction: 'horizontal' }}
    name="input"
    placeholder="I'm underlined"
    label="A label"
  />
</Form>
```

### Minimal theme

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    appearance={{ theme: 'minimal' }}
    name="input"
    placeholder="I'm minimal"
    label="Minimal label"
  />
</Form>
```

### Underline Dotted theme

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    appearance={{ theme: 'dotted', colorSchema: 'grey' }}
    name="input"
    placeholder="I have funny dots"
    label="Dotted label"
  />
</Form>
```

### Input that displays extension

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    name="input"
    appearance={{ theme: 'fat' }}
    label="Tell me your name"
    extensionString=".joincolony.eth"
  />
</Form>
```

### Formatting using [Cleave.js](https://nosir.github.io/cleave.js/)

```js
import { Form } from '../';

<Form initialValues={{ input: '' }}>
  <Input
    name="input"
    placeholder="Put in a big number"
    label="Number formatted"
    formattingOptions={{ numeral: true, delimiter: ',' }}
  />
</Form>
```
