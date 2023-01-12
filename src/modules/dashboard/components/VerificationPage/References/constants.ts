import { defineMessages } from 'react-intl';
import * as yup from 'yup';

const MSG = defineMessages({
  required: {
    id: 'dashboard.VerificationPage.References.required',
    defaultMessage: 'This field is required',
  },
});

export const validationSchema = yup.object().shape({
  bankName: yup
    .string()
    .min(3)
    .required(() => MSG.required),
  contactDetails: yup
    .string()
    .min(3)
    .required(() => MSG.required),
  businessName: yup
    .string()
    .min(3)
    .required(() => MSG.required),
  commercianContactDetails: yup
    .string()
    .min(3)
    .required(() => MSG.required),
});
