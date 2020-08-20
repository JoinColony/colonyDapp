import { FormikHelpers } from 'formik';

export interface WizardProps<FormValues> {
  step: number;
  stepCount: number;
  nextStep: (
    values: FormValues,
    formikHelpers?: FormikHelpers<FormValues>,
  ) => void;
  previousStep: () => void;
  resetWizard: () => void;
  stepCompleted: boolean;
  wizardValues: FormValues;
  wizardForm: {
    initialValues: FormValues;
    validateOnMount: boolean;
  };
}
