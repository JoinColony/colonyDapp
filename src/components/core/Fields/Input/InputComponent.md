A plain input component without all the bells and whistles like labels or auto-generated props to use in other components as well. Supports cleave.js input formatting. Internally our own `<Input>` component uses this one.

It can take all the props React's default `<input>` component can take as well as the ones that are defined here. Because it's just a tiny wrapper the following things need to be taken care of by you:

- Connection to formik / state handling
- Labels
- Correct id for labels
- i18n (no formatting of titles or placeholders)
- Error handling (using `aria-invalid`)

```js
<InputComponent name="inputcomponent" placeholder="Dead simple input" />
```
