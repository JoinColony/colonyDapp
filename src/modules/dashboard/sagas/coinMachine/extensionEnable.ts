import { call, takeEvery, put, all } from 'redux-saga/effects';
import { ClientType, ROOT_DOMAIN_ID, TokenClientType } from '@colony/colony-js';

import { Action, ActionTypes } from '~redux/index';
import {
  ColonyExtensionQuery,
  ColonyExtensionQueryVariables,
  ColonyExtensionDocument,
} from '~data/index';
import extensionData from '~data/staticData/extensionData';
import { ContextModule, TEMP_getContext } from '~context/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { intArrayToBytes32 } from '~utils/web3';

import { getTxChannel } from '../../../core/sagas';
import {
  transactionReady,
  transactionAddParams,
} from '../../../core/actionCreators';

import {
  refreshExtension,
  modifyParams,
  removeOldExtensionClients,
  setupEnablingGroupTransactions,
  Channel,
} from '../utils';

function* extensionEnable({
  meta: { id: metaId },
  meta,
  payload: { colonyAddress, extensionId, ...payload },
}: Action<ActionTypes.COIN_MACHINE_ENABLE>) {
  const extension = extensionData[extensionId];
  const initChannelName = `${meta.id}-initialise`;
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

  yield removeOldExtensionClients(colonyAddress, extensionId);

  if (!extension) {
    throw new Error(`Extension with id ${extensionId} does not exist!`);
  }

  const initChannel = yield call(getTxChannel, initChannelName);

  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

  try {
    const { data } = yield apolloClient.query<
      ColonyExtensionQuery,
      ColonyExtensionQueryVariables
    >({
      query: ColonyExtensionDocument,
      variables: {
        colonyAddress,
        extensionId,
      },
    });

    if (!data) {
      throw new Error('Extension not installed');
    }

    const { address, details } = data.colonyExtension;

    if (!details?.initialized && extension.initializationParams) {
      let shouldSetNewTokenAuthority = false;
      let initParams = [] as any[];

      const tokenClient = yield colonyManager.getTokenClient(
        payload.tokenToBeSold,
      );
      if (tokenClient.tokenClientType === TokenClientType.Colony) {
        const isSoldTokenLocked = yield tokenClient.locked();
        shouldSetNewTokenAuthority = isSoldTokenLocked;
      }

      const params = [
        ...extension.initializationParams,
        ...(extension.extraInitParams ? extension.extraInitParams : []),
      ].sort((a, b) =>
        /* need this logic check for types */
        a.orderNumber && b.orderNumber ? a.orderNumber - b.orderNumber : 1,
      );

      initParams = modifyParams(params, payload);

      const additionalChannels: {
        setUserRolesWithProofs?: Channel;
        deployTokenAuthority?: Channel;
        makeArbitraryTransaction?: Channel;
      } = {};
      if (details?.missingPermissions.length) {
        const bytes32Roles = intArrayToBytes32(details.missingPermissions);
        additionalChannels.setUserRolesWithProofs = {
          context: ClientType.ColonyClient,
          params: [address, ROOT_DOMAIN_ID, bytes32Roles],
        };
      }

      if (shouldSetNewTokenAuthority) {
        const { networkClient } = colonyManager;
        const tokenLockingAddress = yield networkClient.getTokenLocking();

        additionalChannels.deployTokenAuthority = {
          context: ClientType.ColonyClient,
          params: [payload.tokenToBeSold, [address, tokenLockingAddress]],
        };

        additionalChannels.makeArbitraryTransaction = {
          context: ClientType.ColonyClient,
          ready: false,
        };
      }
      const {
        channels,
        transactionChannels,
        transactionChannels: {
          initialise,
          setUserRolesWithProofs,
          deployTokenAuthority,
          makeArbitraryTransaction,
        },
        createGroupTransaction,
      } = yield setupEnablingGroupTransactions(
        metaId,
        initParams,
        extensionId,
        additionalChannels,
      );

      yield all(
        Object.keys(channels).map((channelName) =>
          createGroupTransaction(transactionChannels[channelName], {
            identifier: colonyAddress,
            methodName: channelName,
            ...channels[channelName],
          }),
        ),
      );

      yield all(
        Object.keys(transactionChannels).map((id) =>
          takeFrom(
            transactionChannels[id].channel,
            ActionTypes.TRANSACTION_CREATED,
          ),
        ),
      );

      yield takeFrom(initialise.channel, ActionTypes.TRANSACTION_SUCCEEDED);

      if (setUserRolesWithProofs) {
        yield takeFrom(
          setUserRolesWithProofs.channel,
          ActionTypes.TRANSACTION_SUCCEEDED,
        );
      }

      if (shouldSetNewTokenAuthority) {
        const {
          payload: { deployedContractAddress },
        } = yield takeFrom(
          deployTokenAuthority.channel,
          ActionTypes.TRANSACTION_SUCCEEDED,
        );

        // eslint-disable-next-line max-len
        const encodedAction = tokenClient.interface.functions.setAuthority.encode(
          [deployedContractAddress],
        );

        yield put(
          transactionAddParams(makeArbitraryTransaction.id, [
            payload.tokenToBeSold,
            encodedAction,
          ]),
        );

        yield put(transactionReady(makeArbitraryTransaction.id));

        yield takeFrom(
          makeArbitraryTransaction.channel,
          ActionTypes.TRANSACTION_SUCCEEDED,
        );
      }
    }
    yield call(refreshExtension, colonyAddress, extensionId);
  } catch (error) {
    return yield putError(ActionTypes.COIN_MACHINE_ENABLE_ERROR, error, meta);
  } finally {
    initChannel.close();
  }
  return null;
}

export default function* extensionEnableSaga() {
  yield takeEvery(ActionTypes.COIN_MACHINE_ENABLE, extensionEnable);
}
