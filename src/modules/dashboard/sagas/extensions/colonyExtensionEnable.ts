import { call, fork, takeEvery } from 'redux-saga/effects';
import { ClientType, ROOT_DOMAIN_ID, Extension } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import { Action, ActionTypes } from '~redux/index';
import {
  ColonyExtensionQuery,
  ColonyExtensionQueryVariables,
  ColonyExtensionDocument,
} from '~data/index';
import extensionData, { PolicyType } from '~data/staticData/extensionData';
import {
  ContextModule,
  TEMP_getContext,
  TEMP_setContext,
} from '~context/index';
import { putError } from '~utils/saga/effects';
import { intArrayToBytes32 } from '~utils/web3';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../../../core/sagas';
import { ipfsUpload } from '../../../core/sagas/ipfs';

import { refreshExtension } from '../utils';

function* colonyExtensionEnable({
  meta,
  payload: { colonyAddress, extensionId, ...payload },
}: Action<ActionTypes.COLONY_EXTENSION_ENABLE>) {
  const extension = extensionData[extensionId];
  const initChannelName = `${meta.id}-initialise`;
  const setPermissionChannelName = `${meta.id}-setUserRoles`;
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

  if (!extension) {
    throw new Error(`Extension with id ${extensionId} does not exist!`);
  }

  const key = `${colonyAddress}-${extensionId}`;
  // Remove old extensions client if exist
  colonyManager.extensionClients.delete(key);
  TEMP_setContext(ContextModule.ColonyManager, colonyManager);

  const initChannel = yield call(getTxChannel, initChannelName);
  const setPermissionChannel = yield call(
    getTxChannel,
    setPermissionChannelName,
  );
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
      payload?.policy !== PolicyType.KycOnly
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
      let initParams = [] as any[];

      if (extensionId === Extension.Whitelist) {
        initParams = [
          payload?.policy !== PolicyType.AgreementOnly,
          agreementHash,
        ];
      } else if (extensionId === Extension.CoinMachine) {
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

      yield fork(createTransaction, initChannelName, {
        context: `${extensionId}Client`,
        methodName: 'initialise',
        identifier: colonyAddress,
        params: initParams,
        group: {
          key: 'enableExtension',
          id: meta.id,
          index: 0,
        },
      });
    }

    if (missingPermissions.length) {
      const bytes32Roles = intArrayToBytes32(missingPermissions);
      yield fork(createTransaction, setPermissionChannelName, {
        context: ClientType.ColonyClient,
        methodName: 'setUserRolesWithProofs',
        identifier: colonyAddress,
        params: [address, ROOT_DOMAIN_ID, bytes32Roles],
        group: {
          key: 'enableExtension',
          id: meta.id,
          index: 1,
        },
      });
    }

    yield waitForTxResult(initChannel);
    yield waitForTxResult(setPermissionChannel);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_ENABLE_ERROR,
      error,
      meta,
    );
  } finally {
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const client = yield colonyClient.getExtensionClient(extensionId);
    if (client) {
      colonyManager.extensionClients.set(key, client);
      TEMP_setContext(ContextModule.ColonyManager, colonyManager);
    }
    yield call(refreshExtension, colonyAddress, extensionId);
    initChannel.close();
    setPermissionChannel.close();
  }
  return null;
}

export default function* colonyExtensionEnableSaga() {
  yield takeEvery(ActionTypes.COLONY_EXTENSION_ENABLE, colonyExtensionEnable);
}
