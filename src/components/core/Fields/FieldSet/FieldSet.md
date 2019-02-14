A `<FieldSet>` is a simple html fieldset element with special styles applied. You can use it to separate groups of Form elements visually or wrap a group of horizontal buttons in it.

### FieldSet example

```js
<Input name="fieldsetinput" connect={false} label="Field next to fieldset" />
<FieldSet>
  <Button text="Cool" />
  <Button appearance={{ theme: 'danger' }} text="Cool other button" />
</FieldSet>
```
### Fieldset aligned to the right

```js
<FieldSet appearance={{ align: 'right' }}>
  <Button text="Cool" />
  <Button appearance={{ theme: 'danger' }} text="Cool other button" />
</FieldSet>
```

