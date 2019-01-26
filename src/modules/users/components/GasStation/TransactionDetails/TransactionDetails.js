/* @flow */
import type { HOC } from 'recompose';

import { compose } from 'recompose';
import { connect } from 'react-redux';

import { usernameSelector } from '../../../selectors';

import TransactionDetails from './TransactionDetails.jsx';

const enhance: HOC<*, {}> = compose(
  connect((state: Object) => ({
    username: usernameSelector(state),
  })),
);

export default enhance(TransactionDetails);
