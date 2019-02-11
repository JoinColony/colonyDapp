/* @flow */

import { compose } from 'recompose';
import { connect } from 'react-redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import {
  currentUserAddressSelector,
  currentUserBalanceSelector,
} from '../../../selectors';

import GasStationHeader from './GasStationHeader.jsx';

import type { RootStateRecord } from '~immutable';

export type InProps = {|
  close: () => void,
|};

const enhance = compose(
  connect((state: RootStateRecord) => ({
    walletAddress: currentUserAddressSelector(state),
    balance: currentUserBalanceSelector(state),
  })),
  withImmutablePropsToJS,
);

export default enhance(GasStationHeader);
