import React, { Component } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';

import '../styles/main.css';

import messages from '../i18n/en.json';

addLocaleData(en);

export default class Wrapper extends Component {
  render() {
    return (
      <IntlProvider locale="en" defaultLocale="en" messages={messages}>
        {this.props.children}
      </IntlProvider>
    );
  }
}
