### ErrorBoundry with the child rendering correctly

```jsx
<ErrorBoundry>
  <span>Everything works as expected</span>
</ErrorBoundry>
```

### ErrorBoundry catching an error

```jsx

const ForcedError = () => new Error();

<ErrorBoundry message="Oh No! I crashed!">
  <ForcedError />
</ErrorBoundry>
```
