import { call, fork, takeEvery, put, all } from 'redux-saga/effects';
import {
  ClientType,
  ROOT_DOMAIN_ID,
  Extension,
  TokenClientType,
} from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import { Action, ActionTypes } from '~redux/index';
import {
  ColonyExtensionQuery,
  ColonyExtensionQueryVariables,
  ColonyExtensionDocument,
} from '~data/index';
import extensionData from '~data/staticData/extensionData';
import {
  ContextModule,
  TEMP_getContext,
  TEMP_setContext,
} from '~context/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { intArrayToBytes32 } from '~utils/web3';
import { WhitelistPolicy } from '~types/index';

import {
  createTransaction,
  getTxChannel,
  createTransactionChannels,
} from '../../../core/sagas';
import {
  transactionReady,
  transactionAddParams,
} from '../../../core/actionCreators';
import { ipfsUpload } from '../../../core/sagas/ipfs';

import { refreshExtension } from '../utils';

function* colonyExtensionEnable({
  meta: { id: metaId },
  meta,
  payload: { colonyAddress, extensionId, ...payload },
}: Action<ActionTypes.COLONY_EXTENSION_ENABLE>) {
  const extension = extensionData[extensionId];
  const initChannelName = `${meta.id}-initialise`;
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

  if (!extension) {
    throw new Error(`Extension with id ${extensionId} does not exist!`);
  }

  const key = `${colonyAddress}-${extensionId}`;
  // Remove old extensions client if exist
  colonyManager.extensionClients.delete(key);
  TEMP_setContext(ContextModule.ColonyManager, colonyManager);

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

    /*
     * Upload whitelist policy to IPFS
     */
    let agreementHash = '';
    if (
      extensionId === Extension.Whitelist &&
      payload?.policy !== WhitelistPolicy.KycOnly
    ) {
      agreementHash = yield call(
        ipfsUpload,
        JSON.stringify({
          agreement: payload.agreement,
        }),
      );
    }
    const {
      address,
      details: { initialized, missingPermissions },
    } = data.colonyExtension;

    const modifyParams = (params) =>
      params.map(({ paramName }) => {
        if (typeof payload[paramName] === 'number') {
          return bigNumberify(String(payload[paramName]));
        }
        return payload[paramName];
      });

    if (!initialized && extension.initializationParams) {
      let shouldSetNewTokenAuthority = false;
      let initParams = [] as any[];

      if (extensionId === Extension.Whitelist) {
        initParams = [
          payload?.policy !== WhitelistPolicy.AgreementOnly,
          agreementHash,
        ];
      } else if (extensionId === Extension.CoinMachine) {
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

        initParams = modifyParams(params);
      } else {
        initParams = modifyParams(extension.initializationParams);
      }

      const batchKey = 'enableExtension';

      const channelNames = ['initialise'];

      if (missingPermissions.length) {
        channelNames.push('setUserRolesWithProofs');
      }

      if (shouldSetNewTokenAuthority) {
        channelNames.push('deployTokenAuthority');
        channelNames.push('makeArbitraryTransaction');
      }

      const channels = yield createTransactionChannels(metaId, channelNames);
      const {
        initialise,
        setUserRolesWithProofs,
        deployTokenAuthority,
        makeArbitraryTransaction,
      } = channels;

      const createGroupTransaction = ({ id, index }, config) =>
        fork(createTransaction, id, {
          ...config,
          group: {
            key: batchKey,
            id: metaId,
            index,
          },
        });

      yield createGroupTransaction(initialise, {
        context: `${extensionId}Client`,
        methodName: 'initialise',
        identifier: colonyAddress,
        params: initParams,
      });

      if (setUserRolesWithProofs) {
        const bytes32Roles = intArrayToBytes32(missingPermissions);
        yield createGroupTransaction(setUserRolesWithProofs, {
          context: ClientType.ColonyClient,
          methodName: 'setUserRolesWithProofs',
          identifier: colonyAddress,
          params: [address, ROOT_DOMAIN_ID, bytes32Roles],
        });
      }

      if (shouldSetNewTokenAuthority) {
        const { networkClient } = colonyManager;
        const tokenLockingAddress = yield networkClient.getTokenLocking();

        yield createGroupTransaction(deployTokenAuthority, {
          context: ClientType.ColonyClient,
          methodName: 'deployTokenAuthority',
          identifier: colonyAddress,
          params: [payload.tokenToBeSold, [address, tokenLockingAddress]],
        });

        yield createGroupTransaction(makeArbitraryTransaction, {
          context: ClientType.ColonyClient,
          methodName: 'makeArbitraryTransaction',
          identifier: colonyAddress,
          ready: false,
        });
      }

      yield all(
        Object.keys(channels).map((id) =>
          takeFrom(channels[id].channel, ActionTypes.TRANSACTION_CREATED),
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

        const tokenClient = yield colonyManager.getTokenClient(
          payload.tokenToBeSold,
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
    return yield putError(
      ActionTypes.COLONY_EXTENSION_ENABLE_ERROR,
      error,
      meta,
    );
  } finally {
    initChannel.close();
  }
  return null;
}

export default function* colonyExtensionEnableSaga() {
  yield takeEvery(ActionTypes.COLONY_EXTENSION_ENABLE, colonyExtensionEnable);
}
