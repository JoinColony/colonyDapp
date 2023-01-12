import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import { MIME_TYPES } from './Location';

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
  format: {
    id: 'dashboard.VerificationPage.Details.size',
    defaultMessage: 'Unsupported File Format',
  },
});

export const validationSchema = yup.object().shape({
  address: yup
    .string()
    .min(3)
    .required(() => MSG.required),
  proofOfAddress: yup
    .array()
    .of(
      yup.mixed().test(
        'fileType',
        () => MSG.format,
        (value) => MIME_TYPES.includes(value?.file?.type),
      ),
    )
    .required(() => MSG.required),
  passport: yup.string().required(() => MSG.required),
  country: yup.string().required(() => MSG.required),
  confirmPassport: yup
    .array()
    .of(
      yup.mixed().test(
        'fileType',
        () => MSG.format,
        (value) => MIME_TYPES.includes(value?.file?.type),
      ),
    )
    .required(() => MSG.required),
  taxCountry: yup.string().required(() => MSG.country),
  taxID: yup.string().required(() => MSG.required),
});
