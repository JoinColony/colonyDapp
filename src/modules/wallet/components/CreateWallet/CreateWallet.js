/* @flow */

import { compose } from 'recompose';

import withWizard from '../../../core/components/Wizard';
import CreateWallet from './CreateWallet.jsx';
import WalletDetails from './WalletDetails.jsx';
import CreatePhrase from './../CreatePhrase/CreatePhrase.jsx';
import BackupPhrase from './../BackupPhrase/BackupPhrase.jsx';

const steps = [
  { Step: BackupPhrase },
  { Step: WalletDetails },
  { Step: CreatePhrase },
];

const CreateWalletContainer = compose(
  withWizard({
    steps,
    form: 'create_colony',
  }),
)(CreateWallet);

export default CreateWalletContainer;
