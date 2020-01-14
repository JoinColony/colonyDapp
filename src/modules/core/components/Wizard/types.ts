import { FormikHelpers } from 'formik';

export interface WizardProps<FormValues> {
  step: number;
  stepCount: number;
  nextStep: (
    values: FormValues,
    formikActions?: FormikHelpers<FormValues>,
  ) => void;
  previousStep: () => void;
  resetWizard: () => void;
  wizardValues: FormValues;
  wizardForm: {
    initialValues: {
      [formValue: string]: any;
    };
    isInitialValid: (arg0: object) => boolean;
  };
}
