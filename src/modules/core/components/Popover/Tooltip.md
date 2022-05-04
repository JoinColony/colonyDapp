The Tooltip component uses `react-popper-tooltip` underneath, which in turn uses PopperJS.
The props are pretty self-explanatory except the options to pass to the underlying PopperJS element. 
See here for more: https://popper.js.org/docs/v2/constructors/#options. 


### Simple tooltip
Default placement is to the top.

```jsx
import Button from '../Button';

<Tooltip
    content={<div> "Hi I'm a tooltip. Tipeditip" </div>}
>
  <Button appearance={{ theme: 'danger' }}>Tooltipped</Button>
</Tooltip>
```

### Tooltip on the right

You get the idea...

```js
import Button from '../Button';

<Tooltip
  content={<div> "Hi I'm a tooltip to the right. Tipeditip" </div>}
  placement="right"
>
  <Button appearance={{ theme: 'danger' }}>Righttipped!</Button>
</Tooltip>
```
