/* @flow */

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import withDialog from '~core/Dialog/withDialog';
import { sortObjectsBy } from '~utils/arrays';
import { withImmutablePropsToJS } from '~utils/hoc';
import { tokenSelector } from '../../../dashboard/selectors';

import Tokens from './Tokens.jsx';

const ethAddress = '0x0000000000000000000000000000000000000000';
const isEth = (a: Object, b: Object) => {
  if (a.address === ethAddress) return -1;
  if (b.address === ethAddress) return 1;
  return 0;
};

const enhance = compose(
  withDialog(),
  withProps(({ tokens }) => ({
    tokens: Object.values(tokens || {})
      // $FlowFixMe Object.values result is not mixed
      .sort(sortObjectsBy('isNative'), isEth),
  })),
  connect((state, { tokens }) => {
    const nativeTokenReference = tokens.find(({ isNative }) => !!isNative);
    return {
      nativeToken: tokenSelector(state, {
        tokenAddress: nativeTokenReference.address,
      }),
    };
  }),
  withImmutablePropsToJS,
);

export default enhance(Tokens);
