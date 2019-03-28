### Using `<DialogProvider>`

To use Dialogs you need to wrap your `<App>` with the `<DialogProvider>` (just like with react-router or redux) and you have to pass it a list of DialogComponents:

```js static
const dialogComponents = {
  ConfirmDialog
};

<DialogProvider dialogComponents={dialogComponents}>
  <App />
</DialogProvider>
```

where `dialogComponents` is a list of Components that will be rendered once it is called by it's key using the `withDialog` HoC.


### Using `withDialog`

**Heads up! You might not need this!** Take a look at the [`DialogLink`](#dialoglink) component instead.

Dialogs need to be opened from various components. To be flexible in that regard we created the `withDialog` higher order component. If you need to open one or more dialogs in a component, wrap it in the `withDialog` HoC like so:

```js static
const TaskWithDialogs = withDialog()(Task);
```

`TaskWithDialogs` will get injected an `openDialog` function which you can call anytime to open that dialog. Its key maps to the one in the `dialogComponents` object that we passed to the `DialogProvider`. You can also pass properties that are passed down to the dialg component:

```js static
const Task = ({ openDialog } => (
  <div>
    <Button onClick={() => openDialog('ConfirmDialog', { heading: 'Cool dialog' })}>Open dialog</Button>
  </div>
);
```

`openDialog()` will return a Object which contains an `afterClosed` function which returns a Promise that resolves (or rejects) when the user closes the dialog. Whether it resolves or rejects depends on whether the user closed it using the `close(val)` (resolves with `val`) or the `cancel()` (rejects) function. These get injected into all the Components that reside in `dialogComponents`.


### Example for the whole dialog workflow

```js
import { withDialog, DialogProvider } from '.';
import Button from '../Button'
import ConfirmDialog from './ConfirmDialog.jsx'

const ComponentThatOpensADialog = ({ openDialog }) => (
  <div>
    <Button
      onClick={() => openDialog('ConfirmDialog', { heading: 'Cool dialog' })
        .afterClosed().then(() => alert('Confirmed!'), () => alert('Cancelled'))
      }
    >
      Click to open ConfirmDialog
    </Button>
  </div>
);

const Wrapped = withDialog()(ComponentThatOpensADialog);

<DialogProvider dialogComponents={{ ConfirmDialog }}>
  <Wrapped />
</DialogProvider>
```
