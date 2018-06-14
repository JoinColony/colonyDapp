/* @flow */

import { compose } from 'recompose';

import withWizard from '../../../core/components/Wizard';
import CreateWallet from './CreateWallet.jsx';
import WalletDetails from './WalletDetails.jsx';
import CreatePhrase from './../CreatePhrase/CreatePhrase.jsx';

const steps = [{ Step: CreatePhrase }, { Step: WalletDetails }];

const CreateWalletContainer = compose(
  withWizard({
    steps,
    form: 'create_colony',
  }),
)(CreateWallet);

export default CreateWalletContainer;
