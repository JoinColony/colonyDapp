// Do NOT do this at home! We import the store directly here because we need a sync API (that sagas don't provide)
import store from '~redux/createReduxStore';

import { pendingTransactions } from '../selectors';

const hasPendingTransactions = () => {
  const transactions = pendingTransactions((store as any).getState());
  return !!transactions.size;
};

export default function setupOnBeforeUnload() {
  const handleBeforeunload = (evt) => {
    const disallowUnload = hasPendingTransactions();
    if (disallowUnload) {
      evt.preventDefault();
      // eslint-disable-next-line no-param-reassign
      evt.returnValue = '';
    }
    return evt.returnValue;
  };
  window.addEventListener('beforeunload', handleBeforeunload);
}
