### Textarea

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState();
<Textarea
  elementOnly
  name="textarea"
  placeholder="I am a textarea"
  label="Label"
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```

### Textarea with rows

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState();
<Textarea
  rows="10"
  elementOnly
  name="textarea"
  placeholder="I have 10 rows"
  label="Label"
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```

### Textarea with content

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState('Ex cillum aute aute elit. Sint est ipsum in excepteur dolor. Non veniam sint do nulla exercitation amet aliquip ex officia. Exercitation minim non ad anim velit minim nisi eiusmod laboris do sit cupidatat sit. Officia do esse culpa amet aliqua aute enim fugiat deserunt dolor cupidatat esse nulla cillum. Est est voluptate Lorem aute laboris anim.');
<Textarea
  elementOnly
  name="textarea"
  placeholder="I am a textarea"
  label="Label"
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```


### Textarea fat theme with content

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState('Ex cillum aute aute elit. Sint est ipsum in excepteur dolor. Non veniam sint do nulla exercitation amet aliquip ex officia. Exercitation minim non ad anim velit minim nisi eiusmod laboris do sit cupidatat sit. Officia do esse culpa amet aliqua aute enim fugiat deserunt dolor cupidatat esse nulla cillum. Est est voluptate Lorem aute laboris anim.');
<Textarea
  elementOnly
  appearance={{ theme: 'fat' }}
  name="textarea"
  placeholder="I am a textarea"
  label="Label"
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```

### Textarea with error

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState();
<Textarea
  elementOnly
  name="textareaError"
  placeholder="Hover over me to see error"
  label="Label"
  form={{ errors: { textareaError: 'Wrong!' }, touched: { textareaError: true }}}
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```

### Textarea with label

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState();
<Textarea
  name="textareaWithlabel"
  placeholder="I have a label"
  label="Your personal Story"
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```

### Textarea text with label and error

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState();
<Textarea
  name="textarealabelerror"
  placeholder="I'm wrong as well!"
  label="Label"
  form={{ errors: { textarealabelerror: 'Wrong!' }, touched: { textarealabelerror: true }}}
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```

### Textarea text with label and status

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState();
<Textarea
  name="textareastatus"
  placeholder="I have a status"
  label="Label"
  status="This status is looking good"
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```

### Textarea text with label and extra node

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState();
<Textarea
  name="textareastatus"
  placeholder="I have an extra!"
  label="Look right ->"
  extra={<a href="#">I'm an extra node!</a>}
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```

### Textarea with maximum length

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState('I have a maximum length');
<Textarea
  name="textareamaxlength"
  label="Label"
  connect={false}
  maxLength={90}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```

### Textarea resizable (only vertical!)

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState('I have a maximum length');
<Textarea
  appearance={{ resizable: 'vertical' }}
  name="textareaResizable"
  placeholder="Resize me!"
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```


### Textarea inline with rows and cols and resizable

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState('I have a maximum length');
<Textarea
  rows="10"
  cols="50"
  appearance={{ layout: 'inline', resizable: 'both' }}
  name="textareaInline"
  placeholder="I have 5 rows and 50 cols"
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```


### Textarea with dark color schema

Looks great on dark backgrounds. This should also work for the fat theme.

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState('I have a maximum length');
<Textarea
  appearance={{ colorSchema: 'dark' }}
  name="textareadark"
  placeholder="I'm dark!"
  label="Dark label"
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```

### Textarea with transparent color schema

Uses the background color of its background (same for text). This should also work for the fat theme.

```js
import { useState } from 'react';

const [currentValue, setCurrentValue] = useState('I have a maximum length');
<Textarea
  appearance={{ colorSchema: 'transparent' }}
  name="textareatransparent"
  placeholder="I'm a placeholder"
  label="Cool label"
  connect={false}
  onChange={(e) => setCurrentValue(e.currentTarget.value)}
  value={currentValue}
/>
```


### A form embedded in Formik

```js
import { Formik } from 'formik';
import Button from '../../Button';

<Formik
  initialValues={{
    textarea1: 'Hello let me write some text',
    textarea2: undefined,
  }}
  onSubmit={values => console.log(values)}
>
  {({ handleSubmit }) => (
    <form onSubmit={handleSubmit}>
      <Textarea
        name="textarea1"
        label="Type a text"
        placeholder="Type here"
      />
      <Textarea
        name="textarea2"
        label="I am limited to 50 character"
        maxLength="50"
        placeholder="I should be limited to 50"
      />
      <Button appearance={{ theme: 'primary' }} type="submit">And press me</Button>
    </form>
  )
}
</Formik>
```
