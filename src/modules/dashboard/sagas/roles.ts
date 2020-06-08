import { all, fork, put, take, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  ColonyClient,
  ColonyRoles,
  getColonyRoles,
  ColonyRole,
} from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError } from '~utils/saga/effects';
import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ColonyRolesQuery,
  ColonyRolesQueryVariables,
  ColonyRolesDocument,
} from '~data/index';

import { createTransaction } from '../../core/sagas';
import { getRolesForUserAndDomain } from '../../transformers';

const asColonyRole = (role: string) => (role as unknown) as ColonyRole;

const getRoleMethodName = (role: ColonyRole, setTo: boolean) => {
  switch (role) {
    case ColonyRole.Administration:
      return 'setAdministrationRoleWithProofs';

    case ColonyRole.Arbitration:
      return 'setArbitrationRoleWithProofs';

    case ColonyRole.Architecture:
    case ColonyRole.ArchitectureSubdomain_DEPRECATED:
      return 'setArchitectureRoleWithProofs';

    case ColonyRole.Funding:
      return 'setFundingRoleWithProofs';

    case ColonyRole.Recovery:
      return setTo ? 'setRecoveryRole' : 'removeRecoveryRole';

    case ColonyRole.Root:
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
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const colonyClient: ColonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const colonyRoles: ColonyRoles = yield getColonyRoles(colonyClient);
    const userDomainRoles = getRolesForUserAndDomain(
      colonyRoles,
      userAddress,
      domainId,
    );

    const toChange = Object.entries(roles)
      .filter(([role, setTo]) => {
        if (userDomainRoles.includes(asColonyRole(role)) && setTo === true)
          return false;
        if (!userDomainRoles.includes(asColonyRole(role)) && setTo === false)
          return false;
        return true;
      })
      .sort(([role]) => (asColonyRole(role) === ColonyRole.Root ? 1 : -1))
      .map(
        ([role, setTo]) =>
          [getRoleMethodName(asColonyRole(role), setTo), setTo] as [
            string,
            boolean,
          ],
      );

    yield all(
      toChange.map(([methodName, setTo], index) =>
        fork(createTransaction, `${meta.id}_${methodName}`, {
          context: ClientType.ColonyClient,
          identifier: colonyAddress,
          methodName,
          params: [userAddress, domainId, setTo],
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
          (action) =>
            (action.type === ActionTypes.TRANSACTION_SUCCEEDED ||
              action.type === ActionTypes.TRANSACTION_ERROR ||
              action.type === ActionTypes.TRANSACTION_CANCEL) &&
            action.meta.id === `${meta.id}_${methodName}`,
        ),
      ),
    );
    // Refresh the colony roles in cache
    yield apolloClient.query<ColonyRolesQuery, ColonyRolesQueryVariables>({
      query: ColonyRolesDocument,
      variables: {
        address: colonyAddress,
      },
      fetchPolicy: 'network-only',
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
  yield takeEvery(
    ActionTypes.COLONY_DOMAIN_USER_ROLES_SET,
    colonyDomainUserRolesSet,
  );
}
