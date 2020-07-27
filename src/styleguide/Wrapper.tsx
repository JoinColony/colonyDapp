import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import { Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';

import { Wallet, WalletMethod } from '~immutable/index';

import { CoreTransactions } from '../modules/core/state/index';

import '../styles/main.css';
import '../styles/styleguide.css';

import messages from '../i18n/en.json';

// @ts-ignore
if (!Intl.RelativeTimeFormat) {
  /* eslint-disable global-require */
  require('@formatjs/intl-relativetimeformat/polyfill');
  require('@formatjs/intl-relativetimeformat/dist/locale-data/en');
  /* eslint-enable global-require */
}

interface Props {
  children: ReactNode;
}

interface State {
  admin: Record<string, any> | undefined;
  core: Record<string, any> | undefined;
  dashboard: Record<string, any> | undefined;
  users: Record<string, any> | undefined;
}

const MockState = ImmutableRecord<State>({
  admin: undefined,
  core: undefined,
  dashboard: undefined,
  users: undefined,
});

const initialState = MockState({
  admin: {
    transactions: ImmutableMap(),
    unclaimedTransactions: ImmutableMap(),
  },
  core: {
    transactions: CoreTransactions(),
  },
  dashboard: {
    allComments: ImmutableMap(),
    allDomains: ImmutableMap(),
    allDrafts: ImmutableMap(),
    tasks: ImmutableMap(),
    allColonies: {
      avatars: ImmutableMap(),
      colonies: ImmutableMap(),
      colonyNames: ImmutableMap(),
    },
  },
  users: {
    currentUser: {
      profile: {
        username: 'piglet',
        walletAddress: '0xdeadbeef',
        inboxStoreAddress: '',
        metadataStoreAddress: '',
      },
    },
    wallet: Wallet({
      walletType: WalletMethod.Create,
    }),
    allUsers: ImmutableMap(),
  },
});

const configureStore = () => {
  const reducer = (state = initialState) => state;
  return createStore(reducer);
};

const store = configureStore();
// We're injecting ReactIntl into all of our components, even though it might not be needed everywhere
const Wrapper = ({ children }: Props) => (
  <Provider store={store}>
    <IntlProvider locale="en" defaultLocale="en" messages={messages}>
      <BrowserRouter>{children}</BrowserRouter>
    </IntlProvider>
  </Provider>
);

export default Wrapper;
