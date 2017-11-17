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
// TODO: Just an example, change later
import styles from './modules/core/components/Fields/Input.css';

import ColonyCreationTest from './ColonyCreationTest.jsx';

addLocaleData(en);

const store = createStore(
  rootReducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const Home = () => <div className={styles.main}>Hello World</div>;

export default () => (
  <IntlProvider locale="en" defaultLocale="en" messages={messages}>
    <Provider store={store}>
      <Router>
        <div>
          <Link to="/" href="/">
            <FormattedMessage id="home" />
          </Link>
          <span>--</span>
          <Link to="/createcolony" href="/createcolony">Create a colony</Link>
          <Route exact path="/" component={Home} />
          <Route path="/createcolony" component={ColonyCreationTest} />
        </div>
      </Router>
    </Provider>
  </IntlProvider>
);
