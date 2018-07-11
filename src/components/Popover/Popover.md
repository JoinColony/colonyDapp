### Simple Popover

The styles of the popover content are deliberately kept simple so that you can style the inner content flexibly

```js
<Popover trigger="always"><Button appearance={{ theme: 'primary' }}>Hi</Button></Popover>
```

### Popover on the right

```js
<Popover trigger="always" placement="right"><Button appearance={{ theme: 'primary' }}>Hi</Button></Popover>
```

### Popover on the bottom

```js
<Popover trigger="always" placement="bottom"><Button appearance={{ theme: 'primary' }}>Hi</Button></Popover>
```

### Popover on the left

```js
<Popover trigger="always" placement="left"><Button appearance={{ theme: 'primary' }}>Hi</Button></Popover>
```

### Popover dark theme

```js
<Popover trigger="always" appearance={{ theme: 'dark' }}><Button appearance={{ theme: 'primary' }}>Hi</Button></Popover>
```

### Popover on hover

```js
<Popover trigger="hover" appearance={{ theme: 'dark' }}><Button appearance={{ theme: 'primary' }}>Hover over me</Button></Popover>
```

### Popover on click

```js
<Popover trigger="click" appearance={{ theme: 'dark' }}><Button appearance={{ theme: 'primary' }}>Click me</Button></Popover>
```

### Popover using a render function

Use this method if you have complex elements

**Heads up!** Don't forget to add `aria-describedby` and `innerRef` / `ref` to the button yourself! Same goes for the click / hover handlers. This will happen automatically when using the simple method.

```js
<Popover>
  {({ ref, id, open, close, toggle }) =>
    <Button
      appearance={{ theme: 'primary' }}
      innerRef={ref}
      aria-describedby={id}
      onMouseEnter={open}
      onMouseLeave={close}
    >
      Hi
    </Button>
  }
</Popover>
```
