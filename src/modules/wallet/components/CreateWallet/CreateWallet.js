/* @flow */

import { compose } from 'recompose';

import withWizard from '../../../core/components/Wizard';
import CreateWallet from './CreateWallet.jsx'; // exporting the template that is wrapping the wizard
import WalletDetails from './WalletDetails.jsx';
import CreatePhrase, {
  reduxFormOpts as phraseReduxFormOpts,
} from './../CreatePhrase/CreatePhrase.jsx';
import BackupPhrase, {
  reduxFormOpts as backupReduxFormOpts,
} from './../BackupPhrase/BackupPhrase.jsx';
import DragAndDropPhrase, {
  reduxFormOpts as dragAndDropReduxFormOpts,
} from './../DragAndDropPhrase/DragAndDropPhrase.jsx';

const steps = [
  { Step: WalletDetails },
  { Step: CreatePhrase, reduxFormOpts: phraseReduxFormOpts },
  { Step: BackupPhrase, reduxFormOpts: backupReduxFormOpts },
  { Step: DragAndDropPhrase, reduxFormOpts: dragAndDropReduxFormOpts },
];

const CreateWalletContainer = compose(
  withWizard({
    steps,
    form: 'create_wallet',
  }),
)(CreateWallet);

export default CreateWalletContainer;
