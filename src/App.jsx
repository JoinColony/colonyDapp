/* @flow */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import layout from '~styles/layout.css';

import messages from './i18n/en.json';
import rootReducer from './reducer';

/* eslint-disable-next-line max-len */
import AsyncComponentLoader from './modules/core/components/AsyncComponentLoader';
import CreateColony from './modules/dashboard/components/CreateColony';
import ColonyCreationTest from './ColonyCreationTest.jsx';
import SpinnerLoader from './modules/core/components/Preloaders/SpinnerLoader';

addLocaleData(en);

const store = createStore(
  rootReducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const Home = () => (
  <div>
    <ul>
      <li>
        <NavLink to="/dynamic-import-route">Dynamic Import Route</NavLink>
      </li>
    </ul>
    <p>Hello World</p>
  </div>
);

/*
 * This component is used only as a test reference please remove when setting
 * this up properly. Thanks.
 */
const DynamicImport = () => (
  <AsyncComponentLoader
    loaderFn={() => import('./DynamicImport.jsx')}
    preloader={<SpinnerLoader appearance={{ size: 'medium' }} />}
  />
);

export default function App() {
  return (
    <IntlProvider locale="en" defaultLocale="en" messages={messages}>
      <Provider store={store}>
        <Router>
          <div className={layout.stretch}>
            <Route exact path="/" component={Home} />
            <Route path="/createcolony" component={CreateColony} />
            <Route path="/createcolonytest" component={ColonyCreationTest} />
            <Route path="/dynamic-import-route" component={DynamicImport} />
          </div>
        </Router>
      </Provider>
    </IntlProvider>
  );
}
