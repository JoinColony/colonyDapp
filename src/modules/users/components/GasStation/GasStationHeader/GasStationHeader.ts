import { compose } from 'recompose';
import { connect } from 'react-redux';

import { withImmutablePropsToJS } from '~utils/hoc';

import { RootStateRecord } from '../../../../state';
import {
  walletAddressSelector,
  currentUserBalanceSelector,
} from '../../../selectors';
// @ts-ignore
import GasStationHeader from './GasStationHeader.tsx';

export type InProps = {
  close: () => void;
};

const enhance = compose(
  connect((state: RootStateRecord) => ({
    walletAddress: walletAddressSelector(state),
    balance: currentUserBalanceSelector(state),
  })),
  withImmutablePropsToJS,
);

export default enhance(GasStationHeader);
