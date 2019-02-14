/* @flow */

import LRU from 'lru-cache';

const cache = new LRU({
  max: 500 * 1024, // 500kB, around 30-50 avatars
  length(n) {
    return n ? n.length : 0;
  },
});

export default cache;
