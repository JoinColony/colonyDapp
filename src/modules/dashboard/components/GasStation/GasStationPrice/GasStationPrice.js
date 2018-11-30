/* @flow */
import { compose, withProps } from 'recompose';

import GasStationPrice from './GasStationPrice.jsx';

const enhance = compose(
  withProps(({ transaction: { symbol } }) => ({
    isEth: symbol.toLowerCase() === 'eth',
  })),
);

export default enhance(GasStationPrice);
