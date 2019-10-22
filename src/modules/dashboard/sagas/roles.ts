import { all, fork, put, takeEvery } from 'redux-saga/effects';

import { ROLES } from '~constants';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { executeQuery, putError } from '~utils/saga/effects';
import { ContractContexts } from '~types/index';
import { getColonyRoles, getColonyDomainUserRoles } from '../data/queries';
import { createTransaction } from '../../core/sagas';

function* colonyRolesFetch({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_ROLES_FETCH>) {
  try {
    const roles = yield executeQuery(getColonyRoles, {
      args: undefined,
      metadata: { colonyAddress },
    });
    yield put<AllActions>({
      type: ActionTypes.COLONY_ROLES_FETCH_SUCCESS,
      meta,
      payload: roles,
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_ROLES_FETCH_ERROR, error, meta);
  }
  return null;
}

// Currently not used as we don't really have a way to extend the roles Set (and getting contract events seems to be cheaper)
function* colonyDomainUserRolesFetch({
  payload: { colonyAddress, domainId, userAddress },
  meta,
}: Action<ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH>) {
  try {
    const roles = yield executeQuery(getColonyDomainUserRoles, {
      metadata: { colonyAddress },
      args: { domainId, userAddress },
    });
    yield put<AllActions>({
      type: ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH_SUCCESS,
      meta,
      payload: { roles, colonyAddress, domainId, userAddress },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH_ERROR,
      error,
      meta,
    );
  }
  return null;
}

const getRoleSetFunctionName = (role: string, setTo: boolean) => {
  switch (role) {
    case ROLES.ADMINISTRATION:
      return 'setAdministrationRole';

    // case COLONY_ROLE_ARBITRATION:
    //   return 'setArbitrationRole';

    case ROLES.ARCHITECTURE:
    case ROLES.ARCHITECTURE_SUBDOMAIN:
      return 'setArchitectureRole';

    case ROLES.FUNDING:
      return 'setFundingRole';

    case ROLES.RECOVERY:
      return setTo ? 'setRecoveryRole' : 'removeRecoveryRole';

    case ROLES.ROOT:
      return 'setRootRole';

    default:
      throw new Error(`Invalid role to set: ${role}`);
  }
};

function* colonyDomainUserRolesSet({
  payload: { colonyAddress, domainId, userAddress, roles },
  meta,
}: Action<ActionTypes.COLONY_DOMAIN_USER_ROLES_SET>) {
  try {
    const existingRoles = yield executeQuery(getColonyDomainUserRoles, {
      metadata: { colonyAddress },
      args: { domainId, userAddress },
    });

    const toChange: [string, boolean][] = Object.keys(roles).reduce(
      (acc, role) =>
        existingRoles[role] !== roles[role]
          ? [...acc, [role, roles[role]]]
          : acc,
      [] as [string, boolean][],
    );

    yield all(
      toChange.map(([role, setTo], index) =>
        fork(
          createTransaction,
          `${meta.id}_${getRoleSetFunctionName(role, setTo)}`,
          {
            context: ContractContexts.COLONY_CONTEXT,
            identifier: colonyAddress,
            methodName: getRoleSetFunctionName(role, setTo),
            params: { address: userAddress, domainId, setTo },
            ready: true,
            group: {
              key: 'setRoles',
              id: meta.id,
              index,
            },
          },
        ),
      ),
    );

    yield put<AllActions>({
      type: ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_SUCCESS,
      meta,
      payload: { roles, colonyAddress, domainId, userAddress },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_ERROR,
      error,
      meta,
    );
  }
  return null;
}

export default function* rolesSagas() {
  yield takeEvery(ActionTypes.COLONY_ROLES_FETCH, colonyRolesFetch);
  yield takeEvery(
    ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH,
    colonyDomainUserRolesFetch,
  );
  yield takeEvery(
    ActionTypes.COLONY_DOMAIN_USER_ROLES_SET,
    colonyDomainUserRolesSet,
  );
}
