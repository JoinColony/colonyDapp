/* @flow */

import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

const Home = () => <div>Hello World</div>;
const Other = () => <div>Other route</div>;

export default () => (
  <Router>
    <div>
      <Link to="/" href="/">Home</Link>
      <Link to="/other" href="/other">Other</Link>
      <Route exact path="/" component={Home} />
      <Route path="/other" component={Other} />
    </div>
  </Router>
);
