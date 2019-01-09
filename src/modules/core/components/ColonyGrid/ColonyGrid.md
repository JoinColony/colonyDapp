### Simple colony grid

```js
const { Colony } = require('~immutable');

const colonies = [
  Colony({ name: 'Cool Colony', meta: { address : '0x123456789' } }),
  Colony({ name: 'Twitch.tv', meta: { address : '0x1234567891' } }),
  Colony({ name: 'Zirtual', meta: { address : '0x987654321' } }),
  Colony({ name: 'C21t', meta: { address : '0x123459876' } }),
  Colony({ name: 'Twitch.tv', meta: { address : '0x1234567892' } }),
  Colony({ name: 'Zirtual', meta: { address : '0x9876543211' } }),
  Colony({ name: 'C21t', meta: { address : '0x1234598761' } }),
  Colony({ name: 'Zirtual', meta: { address : '0x9876543212' } }),
  Colony({ name: 'Zirtual', meta: { address : '0x9876543212' } }),
];

<ColonyGrid colonies={colonies} />
```
