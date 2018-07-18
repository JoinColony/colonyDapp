### Button themes

```js
<Button appearance={{ theme: 'primary' }} text="primary button" />
<Button appearance={{ theme: 'secondary' }} text="secondary button" />
<Button appearance={{ theme: 'danger' }} text="danger button" />
<Button appearance={{ theme: 'ghost' }} text="ghost button" />
<Button appearance={{ theme: 'underlinedBold' }} text="underlinedBold button" />
<Button appearance={{ theme: 'blue' }} text="blue button" />
```

### Button sizes

```js
<Button appearance={{ theme: 'primary' }} text="normal button" />
<Button appearance={{ theme: 'primary', size: 'large' }} text="large button" />
```

### Button states

#### Loading

```js
<Button appearance={{ theme: 'primary' }} text="loading button" loading={true} />
<Button appearance={{ theme: 'primary', size: 'large' }} text="loading button" loading={true} />
```

#### Disabled

```js
<Button appearance={{ theme: 'primary' }} text="disabled button" disabled={true} />
<Button appearance={{ theme: 'primary', size: 'large' }} text="disabled button" disabled={true} />
```

### Button with children

You can use it as a normal button using its children for its content. This will _not_ work with `react-intl` `MessageDescriptors`.

```js
<Button appearance={{ theme: 'primary', size: 'large' }}>Cool</Button>
```

### Button with title

Set a custom `title` attribute. This _can_ be a `MessageDescriptor`.

```js
<Button appearance={{ theme: 'danger' }} title="Boo!">Hover over me</Button>
```
