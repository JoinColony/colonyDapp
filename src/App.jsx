/* @flow */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import rootReducer from './reducer';

const store = createStore(
  rootReducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const Home = () => <div>Hello World</div>;
const Other = () => <div>Other route</div>;

export default () => (
  <Provider store={store}>
    <Router>
      <div>
        <Link to="/" href="/">Home</Link>
        <Link to="/other" href="/other">Other</Link>
        <Route exact path="/" component={Home} />
        <Route path="/other" component={Other} />
      </div>
    </Router>
  </Provider>
);
