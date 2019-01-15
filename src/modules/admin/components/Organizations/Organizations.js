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
      colonyDomains: getColonyDomains(state, { colonyENSName: ensName }),
    }),
    { fetchColonyDomains: fetchColonyDomainsAction },
  ),
  lifecycle({
    componentDidMount() {
      const {
        colony: { ensName: colonyENSName },
        colonyDomains,
        fetchColonyDomains,
      } = this.props;
      if (!!colonyDomains && !colonyDomains.length) {
        fetchColonyDomains(colonyENSName);
      }
    },
  }),
);

export default enhance(Organizations);
