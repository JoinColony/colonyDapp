### ErrorBoundry with the child rendering correctly

```jsx
<ErrorBoundry>
  <span>Everything works as expected</span>
</ErrorBoundry>
```

### ErrorBoundry catching an error

```jsx

const ForcedError = () => {
  throw new Error('Do not worry about this error, it is testing the ErrorBoundry component. It will not show in production');
};

<ErrorBoundry message="Oh No! I crashed!">
  <ForcedError />
</ErrorBoundry>
```
