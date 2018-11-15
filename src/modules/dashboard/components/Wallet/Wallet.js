/* @flow */

import { compose, withProps } from 'recompose';

import withDialog from '~core/Dialog/withDialog';

import Wallet from './Wallet.jsx';

import mockTokens from './__datamocks__/mockTokens';

const enhance = compose(
  withDialog(),
  withProps(() => ({
    tokens: mockTokens,
  })),
);

export default enhance(Wallet);
