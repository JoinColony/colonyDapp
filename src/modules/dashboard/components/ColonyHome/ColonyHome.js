/* @flow */

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { withFeatureFlags } from '~utils/hoc';

import type { Given } from '~utils/hoc';

import { walletAddressSelector } from '../../../users/selectors/users';

import ColonyHome from './ColonyHome.jsx';

export type InProps = {
  given: Given,
};

const mockColonyRecoveryMode = true;

const enhance = compose(
  connect((state: Object) => ({
    walletAddress: walletAddressSelector(state),
  })),
  withFeatureFlags(),
  withProps(({ given }) => ({
    /*
     * @TODO Replace with actual selector that checks if the Colony is in recovery mode
     */
    inRecovery: given(mockColonyRecoveryMode),
  })),
);

export default enhance(ColonyHome);
