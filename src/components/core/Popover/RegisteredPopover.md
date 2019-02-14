The `RegisteredPopover` is a Popover that can be opened from anywhere in the dApp. Both the opening component as well as the `RegisteredPopover` have to be wrapped in a `PopoverProvider` though. The `RegisteredPopover` takes all the props the `Popover` takes _plus_ a `name` prop which is mandatory. It's used to identify the Popover and has to be unique.

### Using the `RegisteredPopover`

Here's a full example of how to use the `RegisteredPopover` in conjunction with the `withPopoverControls` HoC. Here we deactivate the trigger on the `RegisteredPopover` to demonstrate the external opening.

```js
const withPopoverControls = require('./withPopoverControls.js').default;

const OtherComponent = ({ openPopover }) => (
  <Button
    appearance={{ theme: 'danger' }}
    onClick={() => openPopover('fooPopover')}
  >
    But clicking me will!
  </Button>
);

const OtherComponentWithControls = withPopoverControls()(OtherComponent);

<PopoverProvider>
  <RegisteredPopover
    name="fooPopover"
    content="Yalp!"
    trigger="disabled"
  >
    <Button>Clicking me won't do anything!</Button>
  </RegisteredPopover>
  <OtherComponentWithControls />
</PopoverProvider>
```
