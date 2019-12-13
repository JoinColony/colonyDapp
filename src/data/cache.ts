/* This file is already part of apollo data. Don't delete */
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

import introspectionResult from './generated';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionResult,
});

export default new InMemoryCache({
  fragmentMatcher,
});
