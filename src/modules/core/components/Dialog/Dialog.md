The Dialog component is a wrapper for all modal-like components which function as a dialog. You can give it any prop you could give a `Modal` and you'd use it as a wrapper like so:

```js static
// Dialog requires the `cancel` function from your outer component to work!
<Dialog cancel={cancel} shouldCloseOnOverlayClick={false}>
  <DialogSection>
    Here is stuff
  </DialogSection>
</Dialog>
```

It ensures that the content will be displayed in a modal and maps the correct properties onto it. Also it applies some necessary styling.
