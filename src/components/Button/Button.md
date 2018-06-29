## Button themes

```js
<Button appearance={{ theme: 'primary' }} value="primary button" />
<Button appearance={{ theme: 'secondary' }} value="secondary button" />
<Button appearance={{ theme: 'danger' }} value="danger button" />
<Button appearance={{ theme: 'ghost' }} value="ghost button" />
<Button appearance={{ theme: 'underlinedBold' }} value="underlinedBold button" />
<Button appearance={{ theme: 'blue' }} value="blue button" />
```

## Button sizes

```js
<Button appearance={{ theme: 'primary' }} value="normal button" />
<Button appearance={{ theme: 'primary', size: 'large' }} value="large button" />
```

## Button states

### Loading

```js
<Button appearance={{ theme: 'primary' }} value="loading button" loading={true} />
<Button appearance={{ theme: 'primary', size: 'large' }} value="loading button" loading={true} />
```

### Disabled

```js
<Button appearance={{ theme: 'primary' }} value="disabled button" disabled={true} />
<Button appearance={{ theme: 'primary', size: 'large' }} value="disabled button" disabled={true} />
```

## Button with children

You can use it as a normal button using its children for its content. This will _not_ work with `react-intl` `MessageDescriptors`.

```js
<Button appearance={{ theme: 'primary', size: 'large' }}>Cool</Button>
```

## Button with title

Set a custom `title` attribute. This _can_ be a `MessageDescriptor`.

```js
<Button appearance={{ theme: 'danger' }} title="Boo!">Hover over me</Button>
```
