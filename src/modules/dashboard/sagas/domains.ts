import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ColonyClient, ROOT_DOMAIN_ID } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ColonyDomainsQuery,
  ColonyDomainsQueryVariables,
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
import { Action, ActionTypes, AllActions } from '~redux/index';
import { log } from '~utils/debug';
import { putError, takeFrom } from '~utils/saga/effects';

import { createTransaction, getTxChannel } from '../../core/sagas';

function* domainCreate({
  payload: { colonyAddress, domainName: name, parentDomainId = ROOT_DOMAIN_ID },
  meta,
}: Action<ActionTypes.DOMAIN_CREATE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    /*
     * @todo Create the domain on the colony with a transaction.
     * @body Idempotency could be improved here by looking for a pending transaction.
     */
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'addDomainWithProofs',
      identifier: colonyAddress,
      params: [parentDomainId],
    });

    /*
     * Get the new domain ID from the successful transaction.
     */
    const {
      payload: {
        eventData: {
          DomainAdded: { domainId },
        },
      },
    } = yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    const ethDomainId = domainId.toNumber();

    /*
     * Add the Domain's metadata to the Mongo database
     */
    const {
      data: {
        createDomain: { id },
      },
    } = yield apolloClient.mutate<
      CreateDomainMutation,
      CreateDomainMutationVariables
    >({
      mutation: CreateDomainDocument,
      variables: {
        input: {
          colonyAddress,
          ethDomainId,
          ethParentDomainId: parentDomainId,
          name,
        },
      },
      update: (cache, { data }) => {
        try {
          const cacheData = cache.readQuery<
            ColonyDomainsQuery,
            ColonyDomainsQueryVariables
          >({
            query: ColonyDomainsDocument,
            variables: { colonyAddress },
          });
          if (cacheData && data && data.createDomain) {
            const domains = cacheData.colony.domains || [];
            domains.push(data.createDomain);
            cache.writeQuery<ColonyDomainsQuery, ColonyDomainsQueryVariables>({
              query: ColonyDomainsDocument,
              data: {
                colony: {
                  ...cacheData.colony,
                  domains,
                },
              },
              variables: {
                colonyAddress,
              },
            });
          }
        } catch (e) {
          log.verbose(e);
          log.verbose('Not updating store - colony domains not loaded yet');
        }
      },
    });

    yield put<AllActions>({
      type: ActionTypes.DOMAIN_CREATE_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        domain: { id, name, ethParentDomainId: parentDomainId, ethDomainId },
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
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

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
      payload: {
        colonyAddress,
        domainId,
        domainName,
        parentId: ROOT_DOMAIN_ID,
      },
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
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

    txChannel = yield call(getTxChannel, meta.id);

    const colonyClient: ColonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const [{ fundingPotId: fromPot }, { fundingPotId: toPot }] = yield all([
      call([colonyClient, colonyClient.getDomain], fromDomain),
      call([colonyClient, colonyClient.getDomain], toDomain),
    ]);

    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'moveFundsBetweenPotsWithProofs',
      identifier: colonyAddress,
      params: [fromPot, toPot, amount, tokenAddress],
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
      // Force resolvers to update, as query resolvers are only updated on a cache miss
      // See #4: https://www.apollographql.com/docs/link/links/state/#resolvers
      // Also: https://www.apollographql.com/docs/react/api/react-apollo/#optionsfetchpolicy
      fetchPolicy: 'network-only',
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
  yield takeEvery(ActionTypes.DOMAIN_CREATE, domainCreate);
  yield takeEvery(ActionTypes.DOMAIN_EDIT, domainEdit);
  yield takeEvery(ActionTypes.MOVE_FUNDS_BETWEEN_POTS, moveFundsBetweenPots);
}
