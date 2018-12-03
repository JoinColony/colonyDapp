/* @flow */

import { connect } from 'react-redux';

import Dashboard from './Dashboard.jsx';

import { currentUser } from '../../../users/selectors';

const enhance = connect(
  state => ({
    currentUser: currentUser(state),
  }),
  null,
);

export default enhance(Dashboard);
