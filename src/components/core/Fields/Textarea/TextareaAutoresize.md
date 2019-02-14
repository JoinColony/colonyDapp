This component is the same as the normal `Textarea`, just that instead of the html `textarea` element, it uses the `react-textarea-autosize` component, added in as an external dependency.

This changes the behaviour of the textarea as it adds the ability to automatically grow up to a certain number of lines, and only after that show the scroll bar.

For simple usage, the only thing you need to change is the `minRows` and `maxRows` values to determine when to stop the textarea's box from growing _(It also accepts all other props from `Fields`)_

If you're looking for more advanced usage, take a look at the underlying component's documentation: [`react-textarea-autosize`](https://github.com/andreypopp/react-textarea-autosize)

```js
<TextareaAutoresize
  name="textarea-which-resizes"
  placeholder="I resize as you add new lines (up to three rows)"
  label="Textarea that automatically resizes"
  connect={false}
  minRows={1}
  maxRows={3}
/>
```
