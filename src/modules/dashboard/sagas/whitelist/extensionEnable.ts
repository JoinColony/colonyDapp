import { all, call, takeEvery } from 'redux-saga/effects';
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
import { WhitelistPolicy } from '~types/index';

import { getTxChannel } from '../../../core/sagas';

import { ipfsUpload } from '../../../core/sagas/ipfs';

import {
  refreshExtension,
  removeOldExtensionClients,
  setupEnablingGroupTransactions,
  Channel,
} from '../utils';

function* extensionEnable({
  meta: { id: metaId },
  meta,
  payload: { colonyAddress, extensionId, ...payload },
}: Action<ActionTypes.WHITELIST_ENABLE>) {
  const extension = extensionData[extensionId];
  const initChannelName = `${meta.id}-initialise`;
  if (!extension) {
    throw new Error(`Extension with id ${extensionId} does not exist!`);
  }

  yield removeOldExtensionClients(colonyAddress, extensionId);

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
    const agreementHash = yield call(
      ipfsUpload,
      JSON.stringify({
        agreement: payload.agreement,
      }),
    );

    const { address, details } = data.colonyExtension;

    if (!details?.initialized && extension.initializationParams) {
      const initParams = [
        payload?.policy !== WhitelistPolicy.AgreementOnly,
        agreementHash,
      ];

      const additionalChannels: {
        setUserRolesWithProofs?: Channel;
      } = {};
      if (details?.missingPermissions.length) {
        const bytes32Roles = intArrayToBytes32(details.missingPermissions);
        additionalChannels.setUserRolesWithProofs = {
          context: ClientType.ColonyClient,
          params: [address, ROOT_DOMAIN_ID, bytes32Roles],
        };
      }

      const {
        channels,
        transactionChannels,
        transactionChannels: { initialise, setUserRolesWithProofs },
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
    }
    yield call(refreshExtension, colonyAddress, extensionId);
  } catch (error) {
    return yield putError(ActionTypes.WHITELIST_ENABLE_ERROR, error, meta);
  } finally {
    initChannel.close();
  }
  return null;
}

export default function* colonyExtensionEnableSaga() {
  yield takeEvery(ActionTypes.WHITELIST_ENABLE, extensionEnable);
}
