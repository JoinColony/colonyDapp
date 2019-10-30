import { all, fork, put, take, takeEvery } from 'redux-saga/effects';

import { ROLES } from '~constants';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { executeQuery, putError } from '~utils/saga/effects';
import { ContractContexts } from '~types/index';
import { ColonyRolesType } from '~immutable/index';

import { getColonyRoles, TEMP_getUserHasColonyRole } from '../data/queries';
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

function* TEMP_userHasRecoveryRoleFetch({
  payload: { colonyAddress, userAddress },
  meta,
}: Action<ActionTypes.TEMP_COLONY_USER_HAS_RECOVERY_ROLE_FETCH>) {
  try {
    const userHasRecoveryRole = yield executeQuery(TEMP_getUserHasColonyRole, {
      args: { userAddress },
      metadata: { colonyAddress },
    });
    yield put<AllActions>({
      type: ActionTypes.TEMP_COLONY_USER_HAS_RECOVERY_ROLE_FETCH_SUCCESS,
      meta,
      payload: { colonyAddress, userAddress, userHasRecoveryRole },
    });
  } catch (error) {
    yield putError(
      ActionTypes.TEMP_COLONY_USER_HAS_RECOVERY_ROLE_FETCH_ERROR,
      error,
      meta,
    );
  }
}

const getRoleMethodName = (role: string, setTo: boolean) => {
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
    const existingColonyRoles: ColonyRolesType = yield executeQuery(
      getColonyRoles,
      {
        metadata: { colonyAddress },
        args: undefined,
      },
    );

    const userHasRecoveryRole = yield executeQuery(TEMP_getUserHasColonyRole, {
      args: { userAddress },
      metadata: { colonyAddress },
    });

    const existingDomainRoles = existingColonyRoles[domainId.toString()] || {};
    const existingUserRoles = existingDomainRoles[userAddress] || [];

    if (userHasRecoveryRole) {
      existingUserRoles.push(ROLES.RECOVERY);
    }

    const toChange = Object.entries(roles)
      .filter(([role, setTo]: [ROLES, boolean]) => {
        if (existingUserRoles.includes(role) && setTo === true) return false;
        if (!existingUserRoles.includes(role) && setTo === false) return false;
        return true;
      })
      .map(
        ([role, setTo]) =>
          [getRoleMethodName(role, setTo), setTo] as [string, boolean],
      );

    yield all(
      toChange.map(([methodName, setTo], index) =>
        fork(createTransaction, `${meta.id}_${methodName}`, {
          context: ContractContexts.COLONY_CONTEXT,
          identifier: colonyAddress,
          methodName,
          params: { address: userAddress, domainId, setTo },
          ready: true,
          group: {
            key: 'setRoles',
            id: meta.id,
            index,
          },
        }),
      ),
    );

    yield put<AllActions>({
      type: ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_SUCCESS,
      meta,
      payload: { roles, colonyAddress, domainId, userAddress },
    });

    // Wait for all of the created actions to be succeeded, failed or cancelled
    yield all(
      toChange.map(([methodName]) =>
        take(
          action =>
            (action.type === ActionTypes.TRANSACTION_SUCCEEDED ||
              action.type === ActionTypes.TRANSACTION_ERROR ||
              action.type === ActionTypes.TRANSACTION_CANCEL) &&
            action.meta.id === `${meta.id}_${methodName}`,
        ),
      ),
    );

    yield put<AllActions>({
      type: ActionTypes.COLONY_ROLES_FETCH,
      payload: { colonyAddress },
      meta,
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
    ActionTypes.COLONY_DOMAIN_USER_ROLES_SET,
    colonyDomainUserRolesSet,
  );
  yield takeEvery(
    ActionTypes.TEMP_COLONY_USER_HAS_RECOVERY_ROLE_FETCH,
    TEMP_userHasRecoveryRoleFetch,
  );
}
