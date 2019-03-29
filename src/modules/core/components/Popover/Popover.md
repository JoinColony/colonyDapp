### Simple Popover

The styles of the popover content are deliberately kept simple so that you can style the inner content flexibly

```js
import Button from '../Button';

<Popover
  isOpen={true}
  content="Simple popover"
>
  <Button appearance={{ theme: 'primary' }}>Hi</Button>
</Popover>
```

### Popover on the right

```js
import Button from '../Button';

<Popover
  isOpen={true}
  placement="right"
  content="Right!"
>
  <Button appearance={{ theme: 'primary' }}>Hi</Button>
</Popover>
```

### Popover on the bottom

```js
import Button from '../Button';

<Popover
  isOpen={true}
  placement="bottom"
  content="I'm on the bottom!"
>
  <Button appearance={{ theme: 'primary' }}>Hi</Button>
</Popover>
```

### Popover on the left

```js
import Button from '../Button';

<Popover
  isOpen={true}
  placement="left"
  content="Left hand side!"
>
  <Button appearance={{ theme: 'primary' }}>Hi</Button>
</Popover>
```

### Popover dark theme

```js
import Button from '../Button';

<Popover
  isOpen={true}
  appearance={{ theme: 'dark' }}
  content="Booo!"
>
  <Button appearance={{ theme: 'primary' }}>Hi</Button>
</Popover>
```

### Popover on hover

```js
import Button from '../Button';

<Popover
  trigger="hover"
  appearance={{ theme: 'dark' }}
  content="You're hovering!"
>
  <Button appearance={{ theme: 'primary' }}>Hover over me</Button>
</Popover>
```

### Popover on hover with open delay

```js
import Button from '../Button';

<Popover
  trigger="hover"
  openDelay={250}
  appearance={{ theme: 'dark' }}
  content="You're hovering!"
>
  <Button appearance={{ theme: 'primary' }}>Hover over me</Button>
</Popover>
```

### Popover on click

```js
import Button from '../Button';

<Popover
  trigger="click"
  appearance={{ theme: 'dark' }}
  content="Stop poking me!"
>
  <Button appearance={{ theme: 'primary' }}>Click me</Button>
</Popover>
```

### Popover using a render prop (function)

Use this method if you have complex elements for the trigger. You can also see how to use the content render prop.

**Heads up!** Don't forget to add `aria-describedby` and `innerRef` / `ref` to the button yourself! Same goes for the click / hover handlers. This will happen automatically when using the simple method.

```js
import Button from '../Button';

<Popover content={({ close }) => <span>Render prop content</span>}>
  {({ ref, id, isOpen, open, close, toggle }) =>
    <Button
      appearance={{ theme: 'primary' }}
      innerRef={ref}
      aria-describedby={isOpen ? id : null}
      onMouseEnter={open}
      onMouseLeave={close}
    >
      Hi
    </Button>
  }
</Popover>
```
