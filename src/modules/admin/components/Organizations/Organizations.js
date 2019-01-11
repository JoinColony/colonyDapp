/* @flow */

import { compose } from 'recompose';
import { connect } from 'react-redux';

import {
  getColonyAdmins,
  getColonyDomains,
} from '../../../dashboard/selectors';

import Organizations from './Organizations.jsx';

const enhance = compose(
  connect((state: Object, { colony: { ensName } }) => ({
    colonyAdmins: getColonyAdmins(state, ensName),
    colonyDomains: getColonyDomains(state, { colonyENSName: ensName }),
  })),
);

export default enhance(Organizations);
