import WizardTemplate from '~pages/WizardTemplate/WizardTemplate';

import withWizard from '../../../core/components/Wizard/withWizard';
import StepCreatePhrase from './StepCreatePhrase';
import StepBackupPhrase from './StepBackupPhrase';
import StepProveMnemonic from './StepProveMnemonic';

const steps = [StepCreatePhrase, StepBackupPhrase, StepProveMnemonic];

const CreateWalletContainer = withWizard({ steps })(WizardTemplate);

export default CreateWalletContainer;
