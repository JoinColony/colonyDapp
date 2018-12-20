/* @flow */

import { compose } from 'recompose';
import { connect } from 'react-redux';

import { getColonyAdmins } from '../../selectors';

import Organizations from './Organizations.jsx';

const enhance = compose(
  connect((state, props) => ({
    colonyAdmins: getColonyAdmins(state, props),
  })),
);

export default enhance(Organizations);
