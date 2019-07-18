/* @flow */

export type WizardProps<FormValues> = {
  step: number,
  stepCount: number,
  nextStep: (values: FormValues) => void,
  previousStep: () => void,
  resetWizard: () => void,
  wizardValues: FormValues,
  wizardForm: {
    initialValues: { [formValue: string]: any },
    isInitialValid: Object => boolean,
  },
};
