import { call, takeEvery } from 'redux-saga/effects';
import { ClientType, ROOT_DOMAIN_ID } from '@colony/colony-js';

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
  refreshExtension,
  modifyParams,
  removeOldExtensionClients,
  setupEnablingGroupTransactions,
  Channel,
} from '../utils';

function* colonyExtensionEnable({
  meta: { id: metaId },
  meta,
  payload: { colonyAddress, extensionId, ...payload },
}: Action<ActionTypes.COLONY_EXTENSION_ENABLE>) {
  const extension = extensionData[extensionId];
  const initChannelName = `${meta.id}-initialise`;

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

    const {
      address,
      details: { initialized, missingPermissions },
    } = data.colonyExtension;

    if (!initialized && extension.initializationParams) {
      const initParams = modifyParams(extension.initializationParams, payload);

      const additionalChannels: {
        setUserRolesWithProofs?: Channel;
      } = {};
      if (missingPermissions.length) {
        const bytes32Roles = intArrayToBytes32(missingPermissions);
        additionalChannels.setUserRolesWithProofs = {
          context: ClientType.ColonyClient,
          params: [address, ROOT_DOMAIN_ID, bytes32Roles],
        };
      }

      const {
        initialise,
        setUserRolesWithProofs,
      } = yield setupEnablingGroupTransactions(
        metaId,
        colonyAddress,
        initParams,
        extensionId,
        additionalChannels,
      );

      yield takeFrom(initialise.channel, ActionTypes.TRANSACTION_SUCCEEDED);

      if (setUserRolesWithProofs) {
        yield takeFrom(
          setUserRolesWithProofs.channel,
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
