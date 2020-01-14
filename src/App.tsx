import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { StoreContext } from 'redux-react-hook';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import { ConnectedRouter } from 'connected-react-router';

import layout from '~styles/layout.css';
import { DialogProvider } from '~core/Dialog';

import dialogComponents from './dialogComponents';
import messages from './i18n/en.json';
import Routes from './routes';
import apolloClient, { ApolloProvider } from './context/apolloClient';

addLocaleData(en);

interface Props {
  store: any;
  history: any;
}

const App = ({ store, history }: Props) => (
  <IntlProvider locale="en" defaultLocale="en" messages={messages}>
    <ApolloProvider client={apolloClient}>
      <StoreContext.Provider value={store}>
        <ReduxProvider store={store}>
          <ConnectedRouter history={history}>
            <DialogProvider dialogComponents={dialogComponents}>
              <div className={layout.stretch}>
                <Routes />
              </div>
            </DialogProvider>
          </ConnectedRouter>
        </ReduxProvider>
      </StoreContext.Provider>
    </ApolloProvider>
  </IntlProvider>
);

export default App;
