import { connect } from 'react-redux';
import { compose } from 'recompose';

import withDialog from '~core/Dialog/withDialog';
import { RootStateRecord } from '~immutable/state';
import { walletAddressSelector } from '../../../users/selectors';
// @ts-ignore
import Wallet from './Wallet.tsx';

const enhance = compose(
  withDialog(),
  connect((state: RootStateRecord) => ({
    walletAddress: walletAddressSelector(state),
  })),
);

export default enhance(Wallet);
