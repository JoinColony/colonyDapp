/* @flow */

import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { fetchColonyDomains as fetchColonyDomainsAction } from '../../../dashboard/actionCreators';

import {
  getColonyAdmins,
  getColonyDomains,
} from '../../../dashboard/selectors';

import Organizations from './Organizations.jsx';

const enhance = compose(
  connect(
    (state: Object, { colony: { ensName } }) => ({
      colonyAdmins: getColonyAdmins(state, ensName),
      colonyDomains: getColonyDomains(state, ensName).toArray(),
    }),
    { fetchColonyDomains: fetchColonyDomainsAction },
  ),
  lifecycle({
    componentDidMount() {
      const {
        colony: { ensName: colonyENSName },
        fetchColonyDomains,
      } = this.props;
      fetchColonyDomains(colonyENSName);
    },
  }),
);

export default enhance(Organizations);
