/* @flow */

import type { FormikBag } from 'formik';

export type WizardFormikBag<Values> = FormikBag<Object, Values> & {
  nextStep: () => void,
  previousStep: () => void,
};

export type SubmitFn<Values> = (
  values: Values,
  goodies: WizardFormikBag<Values>,
) => any;

export type ActionSubmit<Values> = {
  submit: string,
  success: string,
  error: string,
  onSuccess?: (any, WizardFormikBag<Values>) => void,
  onError?: (any, WizardFormikBag<Values>) => void,
  setPayload?: (action: Object, payload: any) => Object,
};
