import { all, call, fork, put, take, takeEvery } from 'redux-saga/effects';
import { Set as ImmutableSet } from 'immutable';

import { ROLES, ROOT_DOMAIN } from '~constants';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError } from '~utils/saga/effects';
import { Context, getContext } from '~context/index';
import { ColonyRolesType, DomainRolesType } from '~immutable/index';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { createAddress } from '~utils/web3';
import {
  Address,
  ContractContexts,
  ColonyClient,
  ColonyManager,
  RoleSet,
} from '~types/index';
import { getEvents } from '~utils/web3/eventLogs';

import { createTransaction } from '../../core/sagas';

interface ColonyRoleSetEventData {
  address: Address;
  domainId: number;
  role: ROLES;
  setTo: boolean;
  eventName: 'ColonyRoleSet';
}

function* getColonyRoles(colonyAddress: Address) {
  const colonyManager: ColonyManager = yield getContext(Context.COLONY_MANAGER);
  const colonyClient: ColonyClient = yield colonyManager.getColonyClient(
    colonyAddress,
  );
  const {
    events: { ColonyRoleSet },
  } = colonyClient;
  const events = yield getEvents(
    colonyClient,
    {
      address: colonyAddress,
      fromBlock: 1,
    },
    {
      events: [ColonyRoleSet],
    },
  );

  // get extension addresses for the colony
  const { address: oneTxAddress } = yield colonyClient.getExtensionAddress.call(
    {
      contractName: 'OneTxPayment',
    },
  );
  const extensionAddresses = [createAddress(oneTxAddress)];

  return (
    events
      // Normalize the address
      .map(event => ({ ...event, address: createAddress(event.address) }))
      // Don't include roles of extensions
      .filter(({ address }) => !extensionAddresses.includes(address))
      // Reduce events to { [domainId]: { [address]: Set<Role> } }
      .reduce(
        (
          colonyRoles,
          { address, setTo, role, domainId }: ColonyRoleSetEventData,
        ) => {
          const domainRoles =
            colonyRoles[domainId.toString()] || ({} as DomainRolesType);
          const userRoles: RoleSet =
            ImmutableSet(domainRoles[address]) || ImmutableSet();

          return {
            ...colonyRoles,
            [domainId.toString()]: {
              ...domainRoles,
              // Add or remove the role, depending on the value of setTo
              [address as Address]: setTo
                ? Array.from(userRoles.add(role))
                : Array.from(userRoles.remove(role)),
            },
          };
        },
        {} as ColonyRolesType,
      )
  );
}

// This will be unnecessary as soon as we have the RecoveryRoleSet event on the ColonyClient
function* TEMP_getUserHasRecoveryRole(
  colonyAddress: Address,
  userAddress: Address = ZERO_ADDRESS,
) {
  const colonyManager: ColonyManager = yield getContext(Context.COLONY_MANAGER);
  const colonyClient: ColonyClient = yield colonyManager.getColonyClient(
    colonyAddress,
  );
  if (!userAddress || userAddress === ZERO_ADDRESS) return false;
  const { hasRole } = yield colonyClient.hasColonyRole.call({
    address: userAddress,
    domainId: ROOT_DOMAIN,
    role: ROLES.RECOVERY,
  });
  return hasRole;
}

function* colonyRolesFetch({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_ROLES_FETCH>) {
  try {
    const roles = yield call(getColonyRoles, colonyAddress);
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
    const userHasRecoveryRole = yield call(
      TEMP_getUserHasRecoveryRole,
      colonyAddress,
      userAddress,
    );
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
    const existingColonyRoles = yield call(getColonyRoles, colonyAddress);

    const userHasRecoveryRole = yield call(
      TEMP_getUserHasRecoveryRole,
      colonyAddress,
      userAddress,
    );

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
      .sort(([role]) => (role === ROLES.ROOT ? 1 : -1))
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
