/* @flow */

import { compose } from 'recompose';
import { connect } from 'react-redux';

import { getColonyAdmins } from '../../../dashboard/selectors';

import Organizations from './Organizations.jsx';

const enhance = compose(
  connect((state: Object, { colony: { ensName } }) => ({
    colonyAdmins: getColonyAdmins(state, ensName),
  })),
);

export default enhance(Organizations);
