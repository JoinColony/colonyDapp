import { Network } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import { SlotKey } from '~context/userSettings';
import { canUseMetatransactions } from '../modules/users/checks';

import { DEFAULT_NETWORK, NETWORK_DATA, SUPPORTED_NETWORKS } from '~constants';

export const checkIfNetworkIsAllowed = (
  walletNetworkId: number | null | undefined,
) => {
  const walletSupportedNetwork = SUPPORTED_NETWORKS[walletNetworkId || 1];
  const onLocalDevEnvironment = process.env.NETWORK === Network.Local;
  const currentNetworkData =
    NETWORK_DATA[process.env.NETWORK || DEFAULT_NETWORK];

  let userSettings;
  let userHasMetatransactionEnabled;
  try {
    userSettings = TEMP_getContext(ContextModule.UserSettings);
    userHasMetatransactionEnabled = userSettings.getSlotStorageAtKey(
      SlotKey.Metatransactions,
    );
  } catch (error) {
    /*
     * This is just needed when developing locally, since the Hot Module Reloader
     * gets tripped up by the context not existing for a brief moment.
     * It's basically a race condition
     */
    // silent error
  }

  const willSendMetaTransactions =
    userHasMetatransactionEnabled && canUseMetatransactions();

  return (
    willSendMetaTransactions ||
    (walletSupportedNetwork &&
      (walletSupportedNetwork.chainId === currentNetworkData.chainId ||
        onLocalDevEnvironment))
  );
};
