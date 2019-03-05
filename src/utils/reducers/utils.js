/* @flow */

import type { ActionTypeString } from '~redux/types/actions';

// eslint-disable-next-line import/prefer-default-export
export const getActionTypes = (
  actionTypes: ActionTypeString | Set<ActionTypeString>,
) => {
  const fetchTypes =
    typeof actionTypes === 'string' ? new Set<*>([actionTypes]) : actionTypes;
  const successTypes = new Set<*>(
    [...fetchTypes.values()].map(type => `${type}_SUCCESS`),
  );
  const errorTypes = new Set<*>(
    [...fetchTypes.values()].map(type => `${type}_ERROR`),
  );
  return { fetchTypes, successTypes, errorTypes };
};
