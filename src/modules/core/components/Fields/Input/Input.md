### Input text

```js
<Input
  elementOnly
  name="input"
  placeholder="I'm an input"
  label="Label"
  connect={false}
/>
```

### Input text with error

```js
<Input
  elementOnly
  name="inputerror"
  placeholder="Hover over me to see error"
  label="Label"
  form={{ errors: { inputerror: 'Wrong!' }, touched: { inputerror: true }}}
  connect={false}
/>
```

### Input text with label

```js
<Input
  name="inputWithlabel"
  placeholder="I have a label"
  label="Your details"
  connect={false}
/>
```

### Input text aligned right

```js
<Input
  appearance={{ align: 'right' }}
  name="inputlabelright"
  placeholder="I'm on the right side!"
  label="You came to the right place"
  connect={false}
/>
```

### Input text with label and error

```js
<Input
  name="inputlabelerror"
  placeholder="I'm wrong as well!"
  label="Label"
  form={{ errors: { inputlabelerror: 'Wrong!' }, touched: { inputlabelerror: true }}}
  connect={false}
/>
```

### Input text with label and status

```js
<Input
  name="inputlabelstatus"
  placeholder="I have a custom status!"
  label="Look!"
  status="This is all good now"
  connect={false}
/>
```

### Input text with label and extra node

```js
<Input
  name="inputlabelextra"
  placeholder="I have an extra node!"
  label="Look right ->"
  extra={<a href="#">I'm an extra node!</a>}
  connect={false}
/>
```

### Input text with horizontal label

```js
<Input
  appearance={{ direction: 'horizontal' }}
  name="inputhorizontal"
  placeholder="I'm horizontal!"
  label="Label"
  connect={false}
/>
```

### Input text with horizontal label and error

```js
<Input
  appearance={{ direction: 'horizontal' }}
  name="inputhorizontalerror"
  placeholder="I'm horizontal and wrong!"
  label="Label"
  form={{ errors: { inputhorizontalerror: 'Wrong!' }, touched: { inputhorizontalerror: true }}}
  connect={false}
/>
```

### Input with dark color schema

Looks great on dark backgrounds. This should also work for the fat theme.

```js
<Input
  appearance={{ colorSchema: 'dark' }}
  name="inputdark"
  placeholder="I'm dark!"
  label="Dark label"
  connect={false}
/>
```

### Input with transparent color schema

Uses the background color of its background (same for text). This should also work for the fat theme.

```js
<Input
  appearance={{ colorSchema: 'transparent' }}
  name="inputtransparent"
  placeholder="I'm a placeholder"
  label="Cool label"
  connect={false}
/>
```

### Fat input field

```js
<Input
  appearance={{ theme: 'fat' }}
  name="inputfat"
  placeholder="I'm fat"
  label="Fat label"
  connect={false}
/>
```

### Underlined theme

```js
<Input
  appearance={{ theme: 'underlined', direction: 'horizontal' }}
  name="inputunderlined"
  placeholder="I'm underlined"
  label="A label"
  connect={false}
/>
```

### Underlined theme error

```js
<Input
  appearance={{ theme: 'underlined', direction: 'horizontal' }}
  name="inputunderlinederror"
  placeholder="I'm underlined"
  label="A label"
  form={{ errors: { inputunderlinederror: 'A meaningful error' }, touched: { inputunderlinederror: true }}}
  connect={false}
/>
```

### Minimal theme

```js
<Input
  appearance={{ theme: 'minimal' }}
  name="inputminimal"
  placeholder="I'm minimal"
  label="Minimal label"
  connect={false}
/>
```

### Underline Dotted theme

```js
<Input
  appearance={{ theme: 'dotted', colorSchema: 'grey' }}
  name="inputdotted"
  placeholder="I have funny dots"
  label="Dotted label"
  connect={false}
/>
```

### Input that displays extension

```js
<Input
  name="ENSname"
  appearance={{ theme: 'fat' }}
  label="Tell me your name"
  extensionString=".joincolony.eth"
  connect={false}
/>
```

### Formatting using [Cleave.js](https://nosir.github.io/cleave.js/)

```js
<Input
  name="inputcleave"
  placeholder="Put in a big number"
  label="Number formatted"
  formattingOptions={{ numeral: true, delimiter: ',' }}
  connect={false}
/>
```

### A form embedded in Formik

```js
import { Formik } from 'formik';
import Button from '../../Button';

<Formik
  initialValues={{
    forminput1: '',
    forminput2: '',
  }}
  onSubmit={values => console.log(values)}
  render={
    ({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Input
          name="forminput1"
          label="Type a string"
          placeholder="Type here"
        />
        <Input
          name="forminput2"
          label="Type a number"
          formattingOptions={{ numeral: true, delimiter: ',' }}
          placeholder="And here"
        />
        <Button appearance={{ theme: 'primary' }} type="submit">And press me</Button>
      </form>
    )
  }
/>
```
