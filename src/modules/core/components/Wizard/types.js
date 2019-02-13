/* @flow */

import type { ActionType } from '~types';

export type WizardProps<FormValues> = {
  step: number,
  stepCount: number,
  nextStep: (values: FormValues) => void,
  previousStep: (values?: FormValues) => void,
  wizardValues: FormValues,
  wizardForm: {
    initialValues: { [formValue: string]: any },
    isInitialValid: Object => boolean,
  },
  formHelpers: {
    includeWizardValues: (
      action: ActionType<*, *, *>,
      currentValues: Object,
    ) => ActionType<*, *, *>,
  },
};
