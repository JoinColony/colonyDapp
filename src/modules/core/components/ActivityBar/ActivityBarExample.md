
### Example for dismissable ActivityBar

```js
const withDialog = require('../Dialog/withDialog.js').default;

const ComponentThatOpensAnActivityBar = ({ openDialog }) => (
  <div>
    <Button
      onClick={() => openDialog('ActivityBarExample').then(
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

