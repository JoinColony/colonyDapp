/* @flow */

import { compose, branch, withProps } from 'recompose';

import { TokenRecord } from '~immutable';

const withToken = compose(
  branch(
    props => props.tokenAddress,
    withProps({
      token: TokenRecord({
        address: '0x0000000000000000000000000000000000000000',
        name: 'Ether',
        symbol: 'ETH',
      }),
    }),
  ),
);

export default withToken;
