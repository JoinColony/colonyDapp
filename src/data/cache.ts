import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  defaultDataIdFromObject,
} from 'apollo-cache-inmemory';

import introspectionResult from './generated';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionResult,
});

const dataIdFromObject = obj => {
  // eslint-disable-next-line no-underscore-dangle
  if (obj.__typename === 'DomainBalance') {
    // Avoid having array arguments inside the cache key
    // Avoid `${address}.${[...domainIds]}`. Cache creates individual entries for each combination
    const { address, colonyAddress, domainId } = obj;
    return `Colony:${colonyAddress}.Token:${address}.Domain:${domainId}`;
  }
  return defaultDataIdFromObject(obj);
};

export default new InMemoryCache({
  dataIdFromObject,
  fragmentMatcher,
});
