/* @flow */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import layout from '~styles/layout.css';

import messages from './i18n/en.json';
import rootReducer from './reducer';

import CreateColony from './modules/dashboard/components/CreateColony';

addLocaleData(en);

const store = createStore(
  rootReducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const Home = () => <div>Hello World</div>;

export default function App() {
  return (
    <IntlProvider locale="en" defaultLocale="en" messages={messages}>
      <Provider store={store}>
        <Router>
          <div className={layout.stretch}>
            <Route exact path="/" component={Home} />
            <Route path="/createcolony" component={CreateColony} />
          </div>
        </Router>
      </Provider>
    </IntlProvider>
  );
}
