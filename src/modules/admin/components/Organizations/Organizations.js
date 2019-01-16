/* @flow */

import { compose, lifecycle, withProps } from 'recompose';
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
        fetchColonyDomains,
      } = this.props;
      fetchColonyDomains(colonyENSName);
    },
  }),
  withProps(({ colonyDomains }) => ({
    /*
     * Sort colony domains alphabetically.
     */
    colonyDomains: colonyDomains.sort((prevDomain, nextDomain) => {
      const prevName = prevDomain.getIn(['record', 'name']).toLowerCase();
      const nextName = nextDomain.getIn(['record', 'name']).toLowerCase();
      if (prevName < nextName) {
        return -1;
      }
      if (prevName > nextName) {
        return 1;
      }
      return 0;
    }),
  })),
);

export default enhance(Organizations);
