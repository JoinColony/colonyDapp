
### Example for ToasterBar


```js
const withDialog = require('../Dialog/withDialog.js').default;

const ComponentThatOpensAToasterBar = ({ openDialog }) => (
  <div>
    <Button
      onClick={() => openDialog('ToasterBarExample').then(
        () => alert('Confirmed'),
        () => alert('Cancelled')
      )}
    >
      Click to open ToasterBar
    </Button>
  </div>
);

const Wrapped = withDialog()(ComponentThatOpensAToasterBar);

<DialogProvider dialogComponents={{ ToasterBarExample }}>
  <Wrapped />
</DialogProvider>
```
