/* @flow */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl';
import en from 'react-intl/locale-data/en';

import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import messages from './i18n/en.json';
import rootReducer from './reducer';

addLocaleData(en);

const store = createStore(
  rootReducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const Home = () => <div>Hello World</div>;
const Other = () => <div>Other route</div>;

export default () => (
  <IntlProvider locale="en" defaultLocale="en" messages={messages}>
    <Provider store={store}>
      <Router>
        <div>
          <Link to="/" href="/">
            <FormattedMessage id="button.ok" />
          </Link>
          <Link to="/other" href="/other">Other</Link>
          <Route exact path="/" component={Home} />
          <Route path="/other" component={Other} />
        </div>
      </Router>
    </Provider>
  </IntlProvider>
);
