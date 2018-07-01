/* @flow */

import type { Node } from 'react';

import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';

import '../styles/main.css';

import messages from '../i18n/en.json';

addLocaleData(en);

type Props = {
  children: Node,
};

const Wrapper = ({ children }: Props) => (
  <IntlProvider locale="en" defaultLocale="en" messages={messages}>
    {children}
  </IntlProvider>
);

export default Wrapper;
