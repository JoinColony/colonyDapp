### Input text

```js
<Input elementOnly name="input" placeholder="I'm an input" label="Label" />
```

### Input text with error

```js
<Input elementOnly name="inputerror" errors={{ inputerror: 'Wrong!' }} touched={{ inputerror: true }} placeholder="Hover over me to see error" label="Label" />
```

### Input text with label

```js
<Input name="inputlabel" placeholder="I have a label" label="Your details" />
```

### Input text with label and error

```js
<Input
  name="inputlabelerror"
  placeholder="I'm wrong as well!"
  label="Label"
  errors={{ inputlabelerror: 'This is not valid!' }}
  touched={{ inputlabelerror: true }}
/>
```

### Input text with horizontal label

```js
<Input
  appearance={{ direction: 'horizontal' }}
  name="inputhorizontal"
  placeholder="I'm horizontal!"
  label="Label"
/>
```

### Input text with horizontal label and error

```js
<Input
  appearance={{ direction: 'horizontal' }}
  name="inputhorizontalerror"
  placeholder="I'm horizontal and wrong!"
  label="Label"
  errors={{ inputhorizontalerror: 'Wrong!' }}
  touched={{ inputhorizontalerror: true }}
/>
```

### Fat input field

### Underlined theme

### A form
