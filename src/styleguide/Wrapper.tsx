import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import en from 'react-intl/locale-data/en';
import { Map as ImmutableMap, Record } from 'immutable';

import {
  CoreTransactions,
  UserRecord,
  UserProfileRecord,
  WalletRecord,
} from '~immutable/index';

import '../styles/main.css';
import '../styles/styleguide.css';

import messages from '../i18n/en.json';

addLocaleData(en);

interface Props {
  children: ReactNode;
}

const MockState = Record({
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
    currentUser: UserRecord({
      profile: UserProfileRecord({
        username: 'piglet',
      }),
    }),
    wallet: WalletRecord({
      availableAddresses: [],
      isLoading: false,
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
