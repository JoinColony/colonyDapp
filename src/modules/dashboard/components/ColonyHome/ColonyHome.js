/* @flow */

import { compose } from 'recompose';
import { connect } from 'react-redux';

import { withFeatureFlags } from '~utils/hoc';
import { withColonyFromRoute } from '../../../core/hocs';

import { getColonyAdmins } from '../../selectors';
import { walletAddressSelector } from '../../../users/selectors/users';

import ColonyHome from './ColonyHome.jsx';

const enhance = compose(
  withColonyFromRoute,
  connect((state: Object, props: Object) => ({
    walletAddress: walletAddressSelector(state),
    colonyAdmins: getColonyAdmins(state, props),
  })),
  withFeatureFlags(),
);

export default enhance(ColonyHome);
