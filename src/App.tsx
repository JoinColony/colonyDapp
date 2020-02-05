import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { StoreContext } from 'redux-react-hook';
import { IntlProvider } from 'react-intl';

import layout from '~styles/layout.css';
import { DialogProvider } from '~core/Dialog';

import dialogComponents from './dialogComponents';
import messages from './i18n/en.json';
import Routes from './routes';
import apolloClient, { ApolloProvider } from './context/apolloClient';

if (!Intl.PluralRules) {
  // eslint-disable-next-line global-require
  require('@formatjs/intl-pluralrules/polyfill');
}

// @ts-ignore
if (!Intl.RelativeTimeFormat) {
  // eslint-disable-next-line global-require
  require('@formatjs/intl-relativetimeformat/polyfill');
}

// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
if (typeof Intl.NumberFormat.__addLocaleData === 'function') {
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  Intl.NumberFormat.__addLocaleData(
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    require('@formatjs/intl-unified-numberformat/dist/locale-data/en.json'),
  );
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
            <DialogProvider dialogComponents={dialogComponents}>
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
