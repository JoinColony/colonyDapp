### Simple Popover

The styles of the popover content are deliberately kept simple so that you can style the inner content flexibly

```js
<Popover><Button appearance={{ theme: 'primary' }}>Hi</Button></Popover>
```

### Popover on the right

```js
<Popover placement="right"><Button appearance={{ theme: 'primary' }}>Hi</Button></Popover>
```

### Popover on the bottom

```js
<Popover placement="bottom"><Button appearance={{ theme: 'primary' }}>Hi</Button></Popover>
```

### Popover on the left

```js
<Popover placement="left"><Button appearance={{ theme: 'primary' }}>Hi</Button></Popover>
```

### Popover dark theme

```js
<Popover appearance={{ theme: 'dark' }}><Button appearance={{ theme: 'primary' }}>Hi</Button></Popover>
```

### Popover using a render function

Use this method if you have complex elements

**Heads up!** Don't forget to add `aria-describedby` and `innerRef` / `ref` to the button yourself! This will happen automatically when using the simple method.

```js
<Popover>
  {({ ref, id }) =>
    <Button
      appearance={{ theme: 'primary' }}
      innerRef={ref}
      aria-describedby={id}
    >
      Hi
    </Button>
  }
</Popover>
```
