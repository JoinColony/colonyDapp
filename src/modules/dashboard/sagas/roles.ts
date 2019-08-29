import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ARCHITECTURE,
  COLONY_ROLE_ARCHITECTURE_SUBDOMAIN,
  COLONY_ROLE_FUNDING,
  COLONY_ROLE_RECOVERY,
  COLONY_ROLE_ROOT,
} from '@colony/colony-js-client';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { executeQuery, putError, takeFrom } from '~utils/saga/effects';
import { getColonyRoles, getColonyDomainUserRoles } from '../data/queries';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';
import { fetchRoles } from '../actionCreators';

function* colonyRolesFetch({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_ROLES_FETCH>) {
  try {
    const roles = yield executeQuery(getColonyRoles, {
      metadata: { colonyAddress },
    });

    /*
     * Dispatch the success action.
     */
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

const getRoleSetFunctionName = role => {
  switch (role) {
    case COLONY_ROLE_ADMINISTRATION:
      return 'setAdministrationRole';

    // case COLONY_ROLE_ARBITRATION:
    //   return 'setArbitrationRole';

    case COLONY_ROLE_ARCHITECTURE:
    case COLONY_ROLE_ARCHITECTURE_SUBDOMAIN:
      return 'setArchitectureRole';

    case COLONY_ROLE_FUNDING:
      return 'setFundingRole';

    case COLONY_ROLE_RECOVERY:
      return 'setRecoveryRole';

    case COLONY_ROLE_ROOT:
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

    const toChange = Object.keys(roles).reduce(
      (acc, role) =>
        existingRoles[role] !== roles[role]
          ? [...acc, [role, roles[role]]]
          : acc,
      [],
    );

    yield all(
      toChange.map(([role, setTo], index) =>
        fork(createTransaction, `${meta.id}_${getRoleSetFunctionName(role)}`, {
          context: COLONY_CONTEXT,
          identifier: colonyAddress,
          methodNaeme: getRoleSetFunctionName(role),
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
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_ERROR,
      error,
      meta,
    );
  }
  return null;
}

function* colonyAdminAdd({
  payload: { newAdmin, colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_ADMIN_ADD>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    /*
     * Set the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'setAdminRole',
      identifier: colonyAddress,
      params: { address: newAdmin, setTo: true },
    });

    // const {
    //   payload: {
    //     transaction: {
    //       receipt: {
    //         logs: [colonyRoleSetLog],
    //       },
    //     },
    //   },
    // } =
    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    /*
     * Dispatch the action to the admin in the Redux store;
     * add the new admin in a pending state.
     */
    yield put<AllActions>({
      type: ActionTypes.COLONY_ADMIN_ADD_SUCCESS,
      payload: { user: newAdmin },
      meta,
    });

    // const colonyManager = yield getContext(Context.COLONY_MANAGER);
    // const colonyClient = yield call(
    //   [colonyManager, colonyManager.getColonyClient],
    //   colonyAddress,
    // );

    /*
     * @TODO Add dismissable notifications
     */
    // const decoratedLog = yield call(
    //   decorateLog,
    //   colonyClient,
    //   colonyRoleSetLog,
    // );
    // yield putNotification(normalizeTransactionLog(colonyAddress, decoratedLog));
    yield put(fetchRoles(colonyAddress));
  } catch (error) {
    return yield putError(ActionTypes.COLONY_ADMIN_ADD_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
  return null;
}

function* colonyAdminRemove({
  payload: { user, colonyAddress },
  payload,
  meta,
}: Action<ActionTypes.COLONY_ADMIN_REMOVE>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);

    /*
     * Remove the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'setAdminRole',
      identifier: colonyAddress,
      params: { address: user, setTo: false },
    });

    // const {
    //   payload: {
    //     transaction: {
    //       receipt: {
    //         logs: [colonyRoleSetLog],
    //       },
    //     },
    //   },
    // } =
    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.COLONY_ADMIN_REMOVE_SUCCESS,
      meta,
      payload,
    });

    // const colonyManager = yield getContext(Context.COLONY_MANAGER);
    // const colonyClient = yield call(
    //   [colonyManager, colonyManager.getColonyClient],
    //   colonyAddress,
    // );

    /*
     * Notification
     */
    // const decoratedLog = yield call(
    //   decorateLog,
    //   colonyClient,
    //   colonyRoleSetLog,
    // );
    // yield putNotification(normalizeTransactionLog(colonyAddress, decoratedLog));
    yield put(fetchRoles(colonyAddress));
  } catch (error) {
    return yield putError(ActionTypes.COLONY_ADMIN_REMOVE_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
  return null;
}

export default function* rolesSagas() {
  yield takeEvery(ActionTypes.COLONY_ROLES_FETCH, colonyRolesFetch);
  yield takeEvery(ActionTypes.COLONY_ADMIN_ADD, colonyAdminAdd);
  yield takeEvery(ActionTypes.COLONY_ADMIN_REMOVE, colonyAdminRemove);
  yield takeEvery(
    ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH,
    colonyDomainUserRolesFetch,
  );
  yield takeEvery(
    ActionTypes.COLONY_DOMAIN_USER_ROLES_SET,
    colonyDomainUserRolesSet,
  );
}
