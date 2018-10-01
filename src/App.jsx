/* @flow */

import React from 'react';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import { ConnectedRouter } from 'connected-react-router';

import messages from './i18n/en.json';
import Routes from './routes';
import layout from '~styles/layout.css';
import { Provider as ContextProvider } from './createReactContext';

import DialogProvider from '~core/Dialog/DialogProvider.jsx';
import ActivityBarExample from '~core/ActivityBar/ActivityBarExample.jsx';

addLocaleData(en);

const dialogComponents = {
  // Hint: Once we have the gas station we just have to add it here
  ActivityBarExample,
};

type Props = {
  store: Object,
  context: Object,
  history: History,
};

const App = ({ store, context, history }: Props) => (
  <IntlProvider locale="en" defaultLocale="en" messages={messages}>
    <ContextProvider value={context}>
      <Provider store={store}>
        <DialogProvider dialogComponents={dialogComponents}>
          <ConnectedRouter history={history}>
            <div className={layout.stretch}>
              <Routes />
            </div>
          </ConnectedRouter>
        </DialogProvider>
      </Provider>
    </ContextProvider>
  </IntlProvider>
);

export default App;
