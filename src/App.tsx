import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { StoreContext } from 'redux-react-hook';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import enNumberData from '@formatjs/intl-unified-numberformat/dist/locale-data/en';

import layout from '~styles/layout.css';
import { DialogProvider } from '~core/Dialog';

import dialogComponents from './dialogComponents';
import messages from './i18n/en.json';
import Routes from './routes';
import apolloClient, { ApolloProvider } from './context/apolloClient';

addLocaleData(en);
addLocaleData(enNumberData);

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
