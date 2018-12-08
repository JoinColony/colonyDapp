/* @flow */

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withFeatureFlags } from '~utils/hoc';

import { walletAddressSelector } from '../../../users/selectors/users';

import ColonyHome from './ColonyHome.jsx';

const enhance = compose(
  connect((state: Object) => ({
    walletAddress: walletAddressSelector(state),
  })),
  withFeatureFlags(),
);

export default enhance(ColonyHome);
