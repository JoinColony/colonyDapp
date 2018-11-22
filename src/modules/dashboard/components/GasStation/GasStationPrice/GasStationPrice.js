/* @flow */
import { compose, withProps } from 'recompose';

import GasStationPrice from './GasStationPrice.jsx';

const enhance = compose(
  withProps(() => ({
    transactionFee: 0.02,
  })),
);

export default enhance(GasStationPrice);
