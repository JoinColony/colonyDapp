### Simple colony grid

```js
const { Colony } = require('~immutable');

const colonies = [
  Colony({ name: 'Cool Colony', address : '0x12345678923452345' }),
  Colony({ name: 'Twitch.tv', address : '0x123234523452344567891' }),
  Colony({ name: 'Zirtual', address : '0x98723452345654321' }),
  Colony({ name: 'C21t', address : '0x12345234523459876' }),
  Colony({ name: 'Twitch.tv', address : '0x123234523454567892' }),
  Colony({ name: 'Zirtual', address : '0x987654345345634563211' }),
  Colony({ name: 'C21t', address : '0x12345345634568898761' }),
  Colony({ name: 'Zirtual', address : '0x9876523434345634563212' }),
  Colony({ name: 'Zirtual', address : '0x987634563456543212' }),
];

<ColonyGrid colonies={colonies} />
```
