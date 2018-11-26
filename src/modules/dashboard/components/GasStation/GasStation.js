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
    transactions: mockTransactions,
    walletAddress: mockUser.walletAddress,
  })),
);

export default enhance(GasStation);
