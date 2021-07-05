import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { StoreContext } from 'redux-react-hook';
import { IntlProvider } from 'react-intl';
import { ApolloProvider } from '@apollo/client';

import layout from '~styles/layout.css';
import { DialogProvider } from '~core/Dialog';

import messages from './i18n/en.json';
import actionMessages from './i18n/en-actions';
import eventsMessages from './i18n/en-events';
import motionMessages from './i18n/en-motions';
import systemMessages from './i18n/en-system-messages';
import Routes from './routes';
import apolloClient from './context/apolloClient';

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
  <IntlProvider
    locale="en"
    defaultLocale="en"
    messages={{
      ...messages,
      ...actionMessages,
      ...eventsMessages,
      ...systemMessages,
      ...motionMessages,
    }}
  >
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
