/* @flow */

import React from 'react';

import type { Props } from '~pages/WizardTemplateColony';

import WizardTemplateColony from '~pages/WizardTemplateColony';

const CreateUserWizard = (props: Props) => (
  <WizardTemplateColony {...props} hideQR />
);

export default CreateUserWizard;
