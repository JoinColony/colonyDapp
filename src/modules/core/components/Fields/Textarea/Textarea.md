### Textarea

```js
<Textarea
  elementOnly
  name="textarea"
  placeholder="I am a textarea"
  label="Label"
  connect={false}
/>
```

### Textarea with rows

```js
<Textarea
  rows="10"
  elementOnly
  name="textarea"
  placeholder="I have 10 rows"
  label="Label"
  connect={false}
/>
```

### Textarea with content

```js
<Textarea
  elementOnly
  name="textarea"
  placeholder="I am a textarea"
  label="Label"
  onChange={n => n}
  value="Ex cillum aute aute elit. Sint est ipsum in excepteur dolor. Non veniam sint do nulla exercitation amet aliquip ex officia. Exercitation minim non ad anim velit minim nisi eiusmod laboris do sit cupidatat sit. Officia do esse culpa amet aliqua aute enim fugiat deserunt dolor cupidatat esse nulla cillum. Est est voluptate Lorem aute laboris anim."
  connect={false}
/>
```


### Textarea fat theme with content

```js
<Textarea
  elementOnly
  appearance={{ theme: 'fat' }}
  name="textarea"
  placeholder="I am a textarea"
  label="Label"
  onChange={n => n}
  value="Ex cillum aute aute elit. Sint est ipsum in excepteur dolor. Non veniam sint do nulla exercitation amet aliquip ex officia. Exercitation minim non ad anim velit minim nisi eiusmod laboris do sit cupidatat sit. Officia do esse culpa amet aliqua aute enim fugiat deserunt dolor cupidatat esse nulla cillum. Est est voluptate Lorem aute laboris anim."
  connect={false}
/>
```

### Textarea with error

```js
<Textarea
  elementOnly
  name="textareaError"
  placeholder="Hover over me to see error"
  label="Label"
  form={{ errors: { textareaError: 'Wrong!' }, touched: { textareaError: true }}}
  connect={false}
/>
```

### Textarea with label

```js
<Textarea
  name="textareaWithlabel"
  placeholder="I have a label"
  label="Your personal Story"
  connect={false}
/>
```

### Textarea text with label and error

```js
<Textarea
  name="textarealabelerror"
  placeholder="I'm wrong as well!"
  label="Label"
  form={{ errors: { textarealabelerror: 'Wrong!' }, touched: { textarealabelerror: true }}}
  connect={false}
/>
```

### Textarea text with label and status

```js
<Textarea
  name="textareastatus"
  placeholder="I have a status"
  label="Label"
  status="This status is looking good"
  connect={false}
/>
```

### Textarea text with label and extra node

```js
<Textarea
  name="textareastatus"
  placeholder="I have an extra!"
  label="Look right ->"
  extra={<a href="#">I'm an extra node!</a>}
  connect={false}
/>
```

### Textarea with maximum length

```js
<Textarea
  name="textareamaxlength"
  $value="I have a maximum length"
  onChange={() => {}}
  label="Label"
  connect={false}
  maxLength={90}
/>
```

### Textarea resizable (only vertical!)

```js
<Textarea
  appearance={{ resizable: 'vertical' }}
  name="textareaResizable"
  placeholder="Resize me!"
  connect={false}
/>
```


### Textarea inline with rows and cols and resizable

```js
<Textarea
  rows="10"
  cols="50"
  appearance={{ layout: 'inline', resizable: 'both' }}
  name="textareaInline"
  placeholder="I have 5 rows and 50 cols"
  connect={false}
/>
```


### Textarea with dark color schema

Looks great on dark backgrounds. This should also work for the fat theme.

```js
<Textarea
  appearance={{ colorSchema: 'dark' }}
  name="textareadark"
  placeholder="I'm dark!"
  label="Dark label"
  connect={false}
/>
```

### Textarea with transparent color schema

Uses the background color of its background (same for text). This should also work for the fat theme.

```js
<Textarea
  appearance={{ colorSchema: 'transparent' }}
  name="textareatransparent"
  placeholder="I'm a placeholder"
  label="Cool label"
  connect={false}
/>
```


### A form embedded in Formik

```js
import { Formik } from 'formik';
import Button from '../../Button';

<Formik
  initialValues={{
    textarea1: 'Hello let me write some text',
  }}
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit }) => (
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
/>
```
