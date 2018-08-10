
### Example for ToasterBar with Interaction required


```js
const withDialog = require('./withDialog.js').default;

const ComponentThatOpensAToasterBar = ({ openDialog }) => (
  <div>
    <Button
      onClick={() => openDialog('ToasterBar', {
        renderContent: ({ cancel, close, setRequiresInteraction, requiresInteraction }) =>
          <>
            { requiresInteraction ?
              (
                <>
                  <div>HELLO I need your attention!!! You can now only... </div>
                  <Button onClick={cancel}>dismiss</Button>
                  <Button onClick={close}>or confirm</Button>
                </>
              ) : (
                <>
                  <div>you can just dismiss me or ... </div>
                  <Button onClick={() => setRequiresInteraction(true) }>make me require your attention</Button>
                </>
              )
            }
          </>
      }).then(
        () => alert('Confirmed'),
        () => alert('Cancelled')
      )}
    >
      Click to open ToasterBar
    </Button>
  </div>
);

const Wrapped = withDialog()(ComponentThatOpensAToasterBar);

<DialogProvider dialogComponents={{ ToasterBar }}>
  <Wrapped />
</DialogProvider>
```
