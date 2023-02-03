import { defineMessages } from 'react-intl';
import * as yup from 'yup';

// eslint-disable-next-line max-len
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const MSG = defineMessages({
  required: {
    id: 'dashboard.VerificationPage.Details.required',
    defaultMessage: 'This field is required',
  },
  phone: {
    id: 'dashboard.VerificationPage.Details.phone',
    defaultMessage: 'Phone number is not valid',
  },
  email: {
    id: 'dashboard.VerificationPage.Details.email',
    defaultMessage: 'Email is not valid',
  },
  selection: {
    id: 'dashboard.VerificationPage.Details.selection',
    defaultMessage: 'Please make a selection',
  },
  country: {
    id: 'dashboard.VerificationPage.Details.country',
    defaultMessage: 'Select country',
  },
});

export const validationSchema = yup.object().shape({
  name: yup.string().required(() => MSG.required),
  phone: yup
    .string()
    .matches(phoneRegExp, () => MSG.phone)
    .required(() => MSG.required),
  email: yup
    .string()
    .email(() => MSG.email)
    .required(() => MSG.required),
  pep: yup.string().required(() => MSG.selection),
});
