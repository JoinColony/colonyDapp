import { getContext } from 'redux-saga/effects';

// Do NOT do this at home! We import the store directly here because we need a sync API (that sagas don't provide)
import store from '~redux/createReduxStore';

import { DDB } from '../../../lib/database';
import IPFSNode from '../../../lib/ipfs';

import {
  pendingTransactions,
  connection as connectionSelector,
} from '../selectors';

import getNetworkHealth from '~core/NetworkHealth/getNetworkHealth';

const hasPendingTransactions = () => {
  const transactions = pendingTransactions((store as any).getState());
  return !!transactions.size;
};

const pinnerIsBusy = (ipfsNode: IPFSNode) =>
  !ipfsNode.pinner || ipfsNode.pinner.busy;

const ddbIsBusy = (ddb: DDB) => ddb.busy;

const networkHealthIsPoor = () => {
  const connectionRecord = connectionSelector((store as any).getState());
  const connection = connectionRecord.toJS();
  const networkItems = getNetworkHealth(connection);
  /*
   * @NOTE This is (currently) exactly the same as the logic inside the `<NetworkHealth />` component
   * I didn't bother centralizing the source (and reducing code repetition) because my view is that
   * at some point these two pieces of logic will diverge into they're own separate paths
   */
  // Errors are important so we set the whole thing to 1 if there are a lot (> 1)
  const health =
    connection.errors.length > 1 || connection.stats.pinners.length < 1
      ? 1
      : Math.round(
          networkItems.reduce((sum, current) => sum + current.itemHealth, 0) /
            networkItems.length,
        );
  return health <= 1;
};

export default function* setupOnBeforeUnload() {
  const ipfsNode = yield getContext('ipfsNode');
  const ddb = yield getContext('ddb');
  const handleBeforeunload = evt => {
    const disallowUnload =
      hasPendingTransactions() ||
      pinnerIsBusy(ipfsNode) ||
      ddbIsBusy(ddb) ||
      networkHealthIsPoor();
    if (disallowUnload) {
      evt.preventDefault();
      // eslint-disable-next-line no-param-reassign
      evt.returnValue = '';
    }
    return evt.returnValue;
  };
  window.addEventListener('beforeunload', handleBeforeunload);
}
