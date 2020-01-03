import ApolloClient from 'apollo-client';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { ROOT_DOMAIN } from '~constants';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { ContractContexts } from '~types/index';
import { getContext, Context } from '~context/index';
import { createTransaction, getTxChannel } from '../../core/sagas';
import {
  ColonyDomainsQuery,
  ColonyDomainsQueryVariables,
  ColonyDomainsQueryResult,
  ColonyDomainsDocument,
  CreateDomainMutation,
  CreateDomainMutationVariables,
  CreateDomainDocument,
  EditDomainMutation,
  EditDomainMutationVariables,
  EditDomainDocument,
  TokenBalancesForDomainsDocument,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
} from '~data/index';

function* colonyDomainsFetch({
  meta,
  payload: {
    colonyAddress,
    options: { fetchRoles } = {
      fetchRoles: true,
    },
  },
}: Action<ActionTypes.COLONY_DOMAINS_FETCH>) {
  try {
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    const { data }: ColonyDomainsQueryResult = yield apolloClient.query<
      ColonyDomainsQuery,
      ColonyDomainsQueryVariables
    >({
      query: ColonyDomainsDocument,
      variables: { colonyAddress },
    });

    if (!data) throw new Error("Could not get the colony's domain metadata");

    const domains = data.colony.domains.map(
      ({ ethDomainId, ethParentDomainId, name }) => ({
        id: ethDomainId,
        parentId: ethParentDomainId,
        name,
        roles: {},
      }),
    );

    yield put<AllActions>({
      type: ActionTypes.COLONY_DOMAINS_FETCH_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        domains,
      },
    });

    if (fetchRoles) {
      yield put<AllActions>({
        type: ActionTypes.COLONY_ROLES_FETCH,
        payload: { colonyAddress },
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.COLONY_DOMAINS_FETCH_ERROR, error, meta);
  }
  return null;
}

function* domainCreate({
  payload: { colonyAddress, domainName: name, parentDomainId = ROOT_DOMAIN },
  meta,
}: Action<ActionTypes.DOMAIN_CREATE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );
    /*
     * @todo Create the domain on the colony with a transaction.
     * @body Idempotency could be improved here by looking for a pending transaction.
     */
    yield fork(createTransaction, meta.id, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'addDomain',
      identifier: colonyAddress,
      params: { parentDomainId },
    });

    /*
     * Get the new domain ID from the successful transaction.
     */
    const {
      payload: {
        eventData: { domainId: id }, // transaction: {
        //   receipt: {
        //     logs: [, domainAddedLog],
        //   },
        // },
      },
    } = yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    /*
     * Add the Domain's metadata to the Mongo database
     */
    yield apolloClient.mutate<
      CreateDomainMutation,
      CreateDomainMutationVariables
    >({
      mutation: CreateDomainDocument,
      variables: {
        input: {
          colonyAddress,
          ethDomainId: id,
          ethParentDomainId: parentDomainId,
          name,
        },
      },
    });

    yield put<AllActions>({
      type: ActionTypes.DOMAIN_CREATE_SUCCESS,
      meta,
      // For now parentId is just root domain
      payload: {
        colonyAddress,
        domain: { id, name, parentId: parentDomainId, roles: {} },
      },
    });

    /*
     * Notification
     */

    // const decoratedLog = yield call(decorateLog, colonyClient, domainAddedLog);
    // yield putNotification(normalizeTransactionLog(colonyAddress, decoratedLog));
  } catch (error) {
    return yield putError(ActionTypes.DOMAIN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

function* domainEdit({
  payload: { colonyAddress, domainName, domainId },
  meta,
}: Action<ActionTypes.DOMAIN_EDIT>) {
  try {
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    /*
     * Update the domain's name in the mongo database
     */
    yield apolloClient.mutate<EditDomainMutation, EditDomainMutationVariables>({
      mutation: EditDomainDocument,
      variables: {
        input: {
          colonyAddress,
          ethDomainId: domainId,
          name: domainName,
        },
      },
    });

    yield put<AllActions>({
      type: ActionTypes.DOMAIN_EDIT_SUCCESS,
      meta,
      // For now parentId is just root domain
      payload: { colonyAddress, domainId, domainName, parentId: ROOT_DOMAIN },
    });
  } catch (error) {
    return yield putError(ActionTypes.DOMAIN_EDIT_ERROR, error, meta);
  }
  return null;
}

function* moveFundsBetweenPots({
  payload: { colonyAddress, fromDomain, toDomain, amount, tokenAddress },
  meta,
}: Action<ActionTypes.MOVE_FUNDS_BETWEEN_POTS>) {
  let txChannel;
  try {
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    txChannel = yield call(getTxChannel, meta.id);

    const colonyManager = yield getContext(Context.COLONY_MANAGER);
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyAddress,
    );
    const [{ potId: fromPot }, { potId: toPot }] = yield all([
      call([colonyClient.getDomain, colonyClient.getDomain.call], {
        domainId: fromDomain,
      }),
      call([colonyClient.getDomain, colonyClient.getDomain.call], {
        domainId: toDomain,
      }),
    ]);

    yield fork(createTransaction, meta.id, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'moveFundsBetweenPots',
      identifier: colonyAddress,
      params: { token: tokenAddress, fromPot, toPot, amount },
    });

    // Replace with TRANSACTION_CREATED if
    // you want the saga to be done as soon as the tx is created
    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    // Refetch token balances for the domains involved
    yield apolloClient.query<
      TokenBalancesForDomainsQuery,
      TokenBalancesForDomainsQueryVariables
    >({
      query: TokenBalancesForDomainsDocument,
      variables: {
        colonyAddress,
        tokenAddresses: [tokenAddress],
        domainIds: [fromDomain, toDomain],
      },
    });

    yield put<AllActions>({
      type: ActionTypes.MOVE_FUNDS_BETWEEN_POTS_SUCCESS,
      payload: { colonyAddress, tokenAddress, fromPot, toPot, amount },
      meta,
    });
  } catch (caughtError) {
    putError(ActionTypes.MOVE_FUNDS_BETWEEN_POTS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* domainSagas() {
  yield takeEvery(ActionTypes.COLONY_DOMAINS_FETCH, colonyDomainsFetch);
  yield takeEvery(ActionTypes.DOMAIN_CREATE, domainCreate);
  yield takeEvery(ActionTypes.DOMAIN_EDIT, domainEdit);
  yield takeEvery(ActionTypes.MOVE_FUNDS_BETWEEN_POTS, moveFundsBetweenPots);
}
