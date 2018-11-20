/* @flow */

import type { NetworkMethodSagaFactory as NMSF } from './methodSagaFactory';

import methodSagaFactory from './methodSagaFactory';
import getMethodFromContext from './getMethodFromContext';

const networkMethodSagaFactory: NMSF = methodSagaFactory.bind(
  null,
  'networkClient',
);

export { getMethodFromContext, methodSagaFactory, networkMethodSagaFactory };
