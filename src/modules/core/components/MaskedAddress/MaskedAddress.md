Show a masked address.

_Note: this component will catch any errors and show a fallback message, if the address is not in the correct format_

### Show a default masked address

```jsx
<MaskedAddress address="0x1afb213afa8729fa7908154b90e256f1be70989a" />
```

### Show a masked address with a custom mask

```jsx
<MaskedAddress
  address="0x1afb213afa8729fa7908154b90e256f1be70989a"
  mask="---"
/>
```

### MaskedAddress can deal with a wrong address string

If the address format is incorrect the `<MaskedAddress />` component will display the _"Address format is wrong!"_ message.

```jsx
<MaskedAddress address="0x0" />
```
