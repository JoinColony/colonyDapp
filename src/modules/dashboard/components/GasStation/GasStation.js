/* @flow */
import type { HOC } from 'recompose';

import { compose, withProps } from 'recompose';

import GasStation from './GasStation.jsx';

import mockTransactions from '~dashboard/Wallet/__datamocks__/mockTransactions';
import mockUser from '~dashboard/Wallet/__datamocks__/mockUser';

export type InProps = {
  close: () => void,
};

const enhance: HOC<*, InProps> = compose(
  withProps(() => ({
    balance: 0.25,
    /*
     * @TODO: handle the logic for `showClaimInfoCard`
     * i.e. User has claimed profile, but not signed any transactions yet
     */
    showClaimInfoCard: !!mockUser.username,
    transactions: mockTransactions,
    walletAddress: mockUser.walletAddress,
  })),
);

export default enhance(GasStation);
