/* @flow */
import type { HOC } from 'recompose';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { allTransactions } from '../../../core/selectors';

import GasStation from './GasStation.jsx';

import mockUser from '~dashboard/Wallet/__datamocks__/mockUser';

export type InProps = {
  close: () => void,
};

const enhance: HOC<*, InProps> = compose(
  connect((state: Object) => ({
    transactions: allTransactions(state)
      .toList()
      .toArray(),
  })),
  withProps(() => ({
    balance: 0.25,
    /*
     * @TODO: handle the logic for `showClaimInfoCard`
     * i.e. User has claimed profile, but not signed any transactions yet
     */
    showClaimInfoCard: !!mockUser.profile.username,
    walletAddress: mockUser.profile.walletAddress,
  })),
);

export default enhance(GasStation);
