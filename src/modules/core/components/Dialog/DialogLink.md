### Using `DialogLink`

When using the `DialogLink`, there is no need to use the withDialog HoC, yet you have a little less control over the lifecycle. This should still suffice in most cases. Keep in mind that `open()` also returns a `Dialog` object (including the `afterClosed` function!)

**Warning: whoever uses something that does not eventually render as a `button` inside the render prop loses all their taco privileges! 🚫🌮**

```js
import Button from '../Button';
import { DialogProvider } from '../Dialog';
import ConfirmDialog from './ConfirmDialog.tsx'

const ComponentThatOpensADialog = () => (
  <div>
    <DialogLink to="ConfirmDialog" props={{ heading: 'Cool dialog' }}>
      {({ open }) => (
        <Button onClick={open}>
          Click to open ConfirmDialog
        </Button>
      )}
    </DialogLink>
  </div>
);

<DialogProvider dialogComponents={{ ConfirmDialog }}>
  <ComponentThatOpensADialog />
</DialogProvider>
```
