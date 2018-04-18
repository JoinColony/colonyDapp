/* @flow */

// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
// We don't polyfill it in the browser--this is user's responsibility.
if (process.env.NODE_ENV === 'test') {
  require('raf').polyfill(global);

  // TODO: find a more stable solution. Because of jsdom, brorand believes
  //       we're in a browser and doesn't call the node crypto code.
  //       We monkey patch `self` to fix this.
  // related code:
  //       https://github.com/indutny/brorand/blob/ \
  //        ddc4f9344287769d7e2c2ea987d26bbeec5456b4/index.js#L30
  const crypto = require('crypto');
  Object.defineProperty(global.self, 'crypto', {
    value: {
      getRandomValues: arr => crypto.randomBytes(arr.length),
    },
  });
}
