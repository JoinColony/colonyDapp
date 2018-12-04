/* @flow */
import { compose, withProps } from 'recompose';

import GasStationPrice from './GasStationPrice.jsx';

const enhance = compose(
  withProps(({ transaction: { symbol } }) => ({
    txGasCostsEth: {
      cheaper: 0.1,
      cheaperWait: 12000,
      faster: 0.05,
      fasterWait: 2300,
      suggested: 0.2,
      suggestedWait: 8640,
    },
    isEth: symbol.toLowerCase() === 'eth',
    isNetworkCongested: true,
    walletNeedsAction: 'hardware',
  })),
);

export default enhance(GasStationPrice);
