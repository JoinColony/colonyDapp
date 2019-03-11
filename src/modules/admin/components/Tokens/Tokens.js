/* @flow */

import { compose, withProps } from 'recompose';

import withDialog from '~core/Dialog/withDialog';
import { sortObjectsBy } from '~utils/arrays';
import { withImmutablePropsToJS } from '~utils/hoc';

import Tokens from './Tokens.jsx';

const enhance = compose(
  withDialog(),
  withProps(() => ({
    // TODO: fetch from Colony record
    tokens: [].sort(sortObjectsBy('isNative')).splice(1, 0, {
      address: '0x0000000000000000000000000000000000000000',
    }),
  })),
  withImmutablePropsToJS,
);

export default enhance(Tokens);
