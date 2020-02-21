import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { StoreContext } from 'redux-react-hook';
import { IntlProvider } from 'react-intl';

import layout from '~styles/layout.css';
import { DialogProvider } from '~core/Dialog';

import messages from './i18n/en.json';
import Routes from './routes';
import apolloClient, { ApolloProvider } from './context/apolloClient';

// @ts-ignore
if (!Intl.RelativeTimeFormat) {
  /* eslint-disable global-require */
  require('@formatjs/intl-relativetimeformat/polyfill');
  require('@formatjs/intl-relativetimeformat/dist/locale-data/en');
  /* eslint-enable global-require */
}

interface Props {
  store: any;
}

const App = ({ store }: Props) => (
  <IntlProvider locale="en" defaultLocale="en" messages={messages}>
    <ApolloProvider client={apolloClient}>
      <StoreContext.Provider value={store}>
        <ReduxProvider store={store}>
          <BrowserRouter>
            <DialogProvider>
              <div className={layout.stretch}>
                <Routes />
              </div>
            </DialogProvider>
          </BrowserRouter>
        </ReduxProvider>
      </StoreContext.Provider>
    </ApolloProvider>
  </IntlProvider>
);

export default App;
