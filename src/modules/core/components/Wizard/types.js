/* @flow */

export type WizardProps<FormValues> = {
  step: number,
  stepCount: number,
  nextStep: () => void,
  previousStep: () => void,
  wizardValues: FormValues,
};
