import { defineMessages } from 'react-intl';
import * as yup from 'yup';

const MSG = defineMessages({
  required: {
    id: 'dashboard.VerificationPage.Details.required',
    defaultMessage: 'Please provide your signature',
  },
});

export const validationSchema = yup.object().shape({
  signature: yup
    .string()
    .min(3)
    .required(() => MSG.required),
});
