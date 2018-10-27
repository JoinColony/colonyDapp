/* @flow */

import ENSResolver from './ENSResolver';

class ColonyResolver extends ENSResolver {
  // eslint-disable-next-line class-methods-use-this
  resolve() {
    throw new Error('cannot yet look up colony databases');
  }
}

export default ColonyResolver;
