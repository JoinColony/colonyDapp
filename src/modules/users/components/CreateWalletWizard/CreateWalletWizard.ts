import compose from 'recompose/compose';

import withWizard from '../../../core/components/Wizard/withWizard';
import CreateWalletWizard from './CreateWalletWizard';

import StepCreatePhrase from './StepCreatePhrase';
import StepBackupPhrase from './StepBackupPhrase';
import StepProveMnemonic from './StepProveMnemonic';

const steps = [StepCreatePhrase, StepBackupPhrase, StepProveMnemonic];

const CreateWalletContainer = compose(withWizard({ steps }))(
  CreateWalletWizard,
);

export default CreateWalletContainer;
