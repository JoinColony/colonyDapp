/* @flow */

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import { ConnectedRouter } from 'connected-react-router';

import messages from './i18n/en.json';
import Routes from './routes';
import layout from '~styles/layout.css';

import DialogProvider from '~core/Dialog/DialogProvider.jsx';
import dialogComponents from './dialogComponents';

addLocaleData(en);

type Props = {
  store: Object,
  history: History,
};

const App = ({ store, history }: Props) => (
  <IntlProvider locale="en" defaultLocale="en" messages={messages}>
    <ReduxProvider store={store}>
      <DialogProvider dialogComponents={dialogComponents}>
        <ConnectedRouter history={history}>
          <div className={layout.stretch}>
            <Routes />
          </div>
        </ConnectedRouter>
      </DialogProvider>
    </ReduxProvider>
  </IntlProvider>
);

export default App;
