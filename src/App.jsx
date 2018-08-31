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
/* eslint-disable-next-line max-len */
import CreateColonyWizard from './modules/dashboard/components/CreateColonyWizard';
import WalletStart from './modules/wallet/components/WalletStart';
import CreateWalletWizard from './modules/wallet/components/CreateWalletWizard';
import { SpinnerLoader } from './modules/core/components/Preloaders';

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
        <NavLink style={{ color: 'blue' }} to="/dynamic-import-route">
          Dynamic Import Route
        </NavLink>
      </li>
      <li>
        <NavLink style={{ color: 'blue' }} to="/createcolony">
          Create Colony Wizard
        </NavLink>
      </li>
      <li>
        <NavLink style={{ color: 'blue' }} to="/start">
          Start
        </NavLink>
      </li>
    </ul>
    <p>Hello World</p>
    {/*
     * This component is used only as a test reference please remove when setting
     * this up properly. Thanks.
     */}
    <AsyncComponentLoader
      loaderFn={() => import('./DynamicComponent.jsx')}
      preloader={<SpinnerLoader appearance={{ size: 'medium' }} />}
    />
  </div>
);

/*
 * This component is used only as a test reference please remove when setting
 * this up properly. Thanks.
 */
const DynamicRoute = () => (
  <AsyncComponentLoader
    loaderFn={() => import('./DynamicRoute.jsx')}
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
            <Route path="/createcolony" component={CreateColonyWizard} />
            <Route path="/dynamic-import-route" component={DynamicRoute} />
            <Route path="/start" component={WalletStart} />
            <Route path="/createwallet" component={CreateWalletWizard} />
          </div>
        </Router>
      </Provider>
    </IntlProvider>
  );
}
