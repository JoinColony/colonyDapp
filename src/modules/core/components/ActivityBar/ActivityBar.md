The ActivityBar component is a wrapper for all components that work as a dismissable or interactive footer bar. It works similar to the Dialog component, as it also uses the `Modal` component and can be passed into `DialogProvider`.

In addition to the props passed to `Modal`, you can pass in `isDismissable={false}` to prevent the ActivityBar from being closed by a close button. This overrides the handling of the passed `close` and `cancel` handlers. Closing and cancelling will be the responsibility of the child component.

The default of `isDismissable` is `true`, which makes the `ActivityBar` show a `close` icon in the right corner.

```js static
// ActivityBar requires the `cancel` function from your outer component to work!
<ActivityBar cancel={cancel} close={close} isDimissable={false} shouldCloseOnEsc={true}>
  <SomeChildBarComponent />
</ActivityBar>
```

It ensures that the content will be displayed in a modal (as a bottom bar) and maps the correct properties onto it. Also it applies some necessary styling.


### Example for ActivityBar

This example component start with `isDismissable={true}` where you can simply dismiss the bar and click through the modal backdrop (e.g. you can still use the app).

You can toggle the mode to `isDismissable={false}` which makes the backdrop opaque and prevents closing of the bar with the close button. The child component has control over `cancel`ing and `close`ing the ActivityBar.


```js
import ActivityBarExample from './ActivityBarExample.jsx';
import { withDialog, DialogProvider } from '../Dialog';
import Button from '../Button';

const ComponentThatOpensAnActivityBar = ({ openDialog }) => (
  <div>
    <Button
      onClick={() => openDialog('ActivityBarExample').afterClosed().then(
        () => alert('Confirmed'),
        () => alert('Cancelled')
      )}
    >
      Click to open ActivityBar
    </Button>
  </div>
);

const Wrapped = withDialog()(ComponentThatOpensAnActivityBar);

<DialogProvider dialogComponents={{ ActivityBarExample }}>
  <Wrapped />
</DialogProvider>
```


