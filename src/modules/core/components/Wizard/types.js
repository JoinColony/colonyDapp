/* @flow */

export type WizardProps<FormValues> = {
  step: number,
  stepCount: number,
  nextStep: (values: FormValues) => void,
  previousStep: (values: FormValues) => void,
  wizardValues: FormValues,
};
