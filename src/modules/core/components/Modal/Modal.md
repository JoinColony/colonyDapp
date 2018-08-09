The modal can take all the properties [react-modal](http://reactcommunity.org/react-modal/#usage) can take. You have to manage the `isOpen` state yourself. For a general purpose dialog field with own state management look at [Dialog](#dialog).

```js static
<Modal isOpen={false}>
  <div style={{ backgroundColor: 'white', padding: '100px' }}>
    This is a Modal
  </div>
</Modal>
```
