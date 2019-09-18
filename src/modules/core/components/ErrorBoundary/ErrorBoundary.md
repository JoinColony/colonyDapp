### ErrorBoundary with the child rendering correctly

```jsx
<ErrorBoundary>
  <span>Everything works as expected</span>
</ErrorBoundary>
```

### ErrorBoundary catching an error

```jsx

const ForcedError = () => {
  throw new Error('Do not worry about this error, it is testing the ErrorBoundary component. It will not show in production');
};

<ErrorBoundary message="Oh No! I crashed!">
  <ForcedError />
</ErrorBoundary>
```
