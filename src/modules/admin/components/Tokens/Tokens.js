/* @flow */

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import type { TokenReferenceType } from '~immutable';

import withDialog from '~core/Dialog/withDialog';
import { sortObjectsBy } from '~utils/arrays';
import { withImmutablePropsToJS } from '~utils/hoc';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { addressEquals } from '~utils/strings';
import { nativeFromColonyTokensSelector } from '../../../dashboard/selectors';

import Tokens from './Tokens.jsx';

const isEth = (a: TokenReferenceType, b: TokenReferenceType) => {
  if (addressEquals(a.address, ZERO_ADDRESS)) return -1;
  if (addressEquals(b.address, ZERO_ADDRESS)) return 1;
  return 0;
};

const enhance = compose(
  withDialog(),
  withProps(({ tokens }) => ({
    tokens: Object.values(tokens || {})
      // $FlowFixMe Object.values result is not mixed
      .sort(sortObjectsBy('isNative'), isEth),
  })),
  connect((state, { tokens }) => ({
    nativeToken: nativeFromColonyTokensSelector(state, tokens),
  })),
  withImmutablePropsToJS,
);

export default enhance(Tokens);
