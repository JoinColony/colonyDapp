import React from 'react';

import WizardTemplateColony, { Props } from '~pages/WizardTemplateColony';

const CreateUserWizard = ({ children, ...props }: Props) => (
  <WizardTemplateColony {...props} hideQR>
    {children}
  </WizardTemplateColony>
);

export default CreateUserWizard;
