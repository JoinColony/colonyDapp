## Clipboard Copy

```tsx
const stringToCopy = 'Copy this string';

<>
  {stringToCopy}
  {' '}
  <ClipboardCopy value={stringToCopy} />
</>
```