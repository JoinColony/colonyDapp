/* @flow */

import { compose } from 'recompose';
import { connect } from 'react-redux';

import { withImmutablePropsToJS } from '~utils/hoc';

import {
  walletAddressSelector,
  currentUserBalanceSelector,
} from '../../../selectors';

import GasStationHeader from './GasStationHeader.jsx';

import type { RootStateRecord } from '~immutable';

export type InProps = {|
  close: () => void,
|};

const enhance = compose(
  connect((state: RootStateRecord) => ({
    walletAddress: walletAddressSelector(state),
    balance: currentUserBalanceSelector(state),
  })),
  withImmutablePropsToJS,
);

export default enhance(GasStationHeader);
