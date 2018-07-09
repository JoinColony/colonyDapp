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
  form={{ errors: { inputerror: 'Wrong!' }, touched: { inputerror: true }}}
  placeholder="Hover over me to see error"
  label="Label"
  connect={false}
/>
```

### Input text with label

```js
<Input
  name="inputlabel"
  placeholder="I have a label"
  label="Your details"
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

### A form
