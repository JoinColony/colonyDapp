/* @flow */

import { List } from 'immutable';
import { Domain } from '~immutable';

const mockDomains = List.of(
  Domain({ id: 1, name: 'dApp' }),
  Domain({ id: 2, name: 'JS Library' }),
  Domain({ id: 3, name: 'Smart Contracts' }),
  Domain({ id: 4, name: 'Design' }),
  Domain({ id: 5, name: 'Marketing' }),
  Domain({ id: 6, name: 'Branding' }),
  Domain({
    id: 7,
    name:
      'A domain with a very very very looooooooooong name. And I mean long!',
  }),
  Domain({ id: 8, name: 'Biz Dev' }),
);

export const selectedDomainMock = 2;

export default mockDomains;
