### Simple tooltip

```js
import Button from '../Button';

<Tooltip
  content="Hi I'm a tooltip. Tipeditip"
>
  <Button appearance={{ theme: 'danger' }}>Tooltipped</Button>
</Tooltip>
```

### Tooltip on the right

You get the idea...

```js
import Button from '../Button';

<Tooltip
  content="Hi I'm a tooltip on the right"
  placement="right"
>
  <Button appearance={{ theme: 'danger' }}>Righttipped!</Button>
</Tooltip>
```
