import { getContext } from 'redux-saga/effects';

// Do NOT do this at home! We import the store directly here because we need a sync API (that sagas don't provide)
import store from '~redux/createReduxStore';

import { DDB } from '../../../lib/database';
import IPFSNode from '../../../lib/ipfs';

import { pendingTransactions } from '../selectors';

const hasPendingTransactions = () => {
  const transactions = pendingTransactions((store as any).getState());
  return !!transactions.size;
};

const pinnerIsBusy = (ipfsNode: IPFSNode) =>
  !ipfsNode.pinner || ipfsNode.pinner.busy;

const ddbIsBusy = (ddb: DDB) => ddb.busy;

export default function* setupOnBeforeUnload() {
  const ipfsNode = yield getContext('ipfsNode');
  const ddb = yield getContext('ddb');
  const handleBeforeunload = evt => {
    const disallowUnload =
      hasPendingTransactions() || pinnerIsBusy(ipfsNode) || ddbIsBusy(ddb);
    if (disallowUnload) {
      evt.preventDefault();
      // eslint-disable-next-line no-param-reassign
      evt.returnValue = '';
    }
    return evt.returnValue;
  };
  window.addEventListener('beforeunload', handleBeforeunload);
}
