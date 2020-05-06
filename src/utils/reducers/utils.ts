import { ActionTypeString } from '~redux/types/actions';

export const getActionTypes = (
  actionTypes: ActionTypeString | Set<ActionTypeString>,
) => {
  const fetchTypes =
    typeof actionTypes === 'string' ? new Set<any>([actionTypes]) : actionTypes;
  const successTypes = new Set<any>(
    // @ts-ignore
    [...fetchTypes.values()].map((type) => `${type}_SUCCESS`),
  );
  const errorTypes = new Set<any>(
    // @ts-ignore
    [...fetchTypes.values()].map((type) => `${type}_ERROR`),
  );
  return { fetchTypes, successTypes, errorTypes };
};
