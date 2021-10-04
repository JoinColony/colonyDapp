import { defineMessages } from 'react-intl';
import * as yup from 'yup';

const MSG = defineMessages({
  amountZero: {
    id: 'dashboard.AwardAndSmiteDialogForm.amountZero',
    defaultMessage: 'Amount must be greater than zero',
  },
});

export const AwardAndSmiteFormValidationSchema = yup.object().shape({
  domainId: yup.number().required(),
  user: yup.object().shape({
    profile: yup.object().shape({
      walletAddress: yup.string().address().required(),
    }),
  }),
  amount: yup
    .number()
    .required()
    .moreThan(0, () => MSG.amountZero),
  annotation: yup.string().max(4000),
  forceAction: yup.boolean(),
  motionDomainId: yup.number(),
});
