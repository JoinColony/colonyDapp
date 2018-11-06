/* @flow */

import type { Node } from 'react';

import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import en from 'react-intl/locale-data/en';

import '../styles/main.css';

import messages from '../i18n/en.json';

addLocaleData(en);

type Props = {
  children: Node,
};

// We're injecting ReactIntl into all of our components, even though it might not be needed everywhere
const Wrapper = ({ children }: Props) => (
  <IntlProvider locale="en" defaultLocale="en" messages={messages}>
    <BrowserRouter>{children}</BrowserRouter>
  </IntlProvider>
);

export default Wrapper;
