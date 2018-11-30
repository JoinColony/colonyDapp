/* @flow */

import type { Node } from 'react';

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import en from 'react-intl/locale-data/en';

import '../styles/main.css';

import messages from '../i18n/en.json';

addLocaleData(en);

type Props = {
  children: Node,
};

const initialState = {
  users: {
    currentUser: null,
    wallet: {
      availableAddresses: [],
      isLoading: false,
    },
    allUsers: {
      isLoading: false,
      users: {},
      avatars: {},
    },
  },
};

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
