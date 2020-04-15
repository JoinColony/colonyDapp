
## Badge

```tsx
import camelcase from 'camelcase';

import { badges } from '../../../../img/icons.json';

<div style={{ display: 'flex', flexWrap: 'wrap' }}>
  {badges.map((badgeName) => {
    const name = camelcase(badgeName);
    return (
      <div
        key={badgeName}
        style={{
          flexBasis: `${100/3}%`,
          margin: '10px 0',
          textAlign: 'center',
        }}
      >
        <div>
          <Badge name={name} title={badgeName} />
        </div>
        <div>
          <code>{name}</code>
        </div>
      </div>
    )
  })}
</div>
```
