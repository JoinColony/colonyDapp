/* @flow */

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { StoreContext } from 'redux-react-hook';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import { ConnectedRouter } from 'connected-react-router';

import layout from '~styles/layout.css';
import { DialogProvider } from '~core/Dialog';
import { PopoverProvider } from '~core/Popover';

import dialogComponents from './dialogComponents';
import messages from './i18n/en.json';
import Routes from './routes';

addLocaleData(en);

type Props = {
  store: Object,
  history: History,
};

const App = ({ store, history }: Props) => (
  <IntlProvider locale="en" defaultLocale="en" messages={messages}>
    <StoreContext.Provider value={store}>
      <ReduxProvider store={store}>
        <PopoverProvider>
          <ConnectedRouter history={history}>
            <DialogProvider dialogComponents={dialogComponents}>
              <div className={layout.stretch}>
                <Routes />
              </div>
            </DialogProvider>
          </ConnectedRouter>
        </PopoverProvider>
      </ReduxProvider>
    </StoreContext.Provider>
  </IntlProvider>
);

export default App;
