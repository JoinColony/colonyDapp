/* @flow */

import type { Node } from 'react';
import type { Store } from 'redux';

import useBeforeUnload from 'use-before-unload';

import type { RootContext } from '~context';

import { pendingTransactions } from './modules/core/selectors';

type Props = {
  children: Node,
  store: Store<*, *>,
  context: RootContext,
};

const hasPendingTransactions = (store: Store<*, *>) => {
  const transactions = pendingTransactions(store.getState());
  return !!transactions.size;
};

const pinnerIsBusy = (context: RootContext) => context.ipfsNode.pinner.busy;

const UnloadInterceptor = ({ children, store, context }: Props) => {
  useBeforeUnload(
    () =>
      // We could open a dialog here but I don't know if that makes a lot of sense
      // It will open AFTER the user clicked "stay on this site"
      hasPendingTransactions(store) || pinnerIsBusy(context),
    // || storesAreReplicating(context);
  );
  return children;
};

export default UnloadInterceptor;
