import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import { toFinite } from 'lodash';
import { defineMessages } from 'react-intl';

import { newFundingSource } from '~dashboard/ExpenditurePage/ExpenditureSettings/Streaming/constants';
import { newRecipient } from '~dashboard/ExpenditurePage/Payments/constants';
import { initalRecipient } from '~dashboard/ExpenditurePage/Split/constants';
import { initalMilestone } from '~dashboard/ExpenditurePage/Staged/constants';

import { ExpenditureTypes } from './types';

const MSG = defineMessages({
  userRequiredError: {
    id: 'dashboard.ExpenditurePage.userRequiredError',
    defaultMessage: 'User is required',
  },
  teamRequiredError: {
    id: 'dashboard.ExpenditurePage.teamRequiredError',
    defaultMessage: 'Team is required',
  },
  valueError: {
    id: 'dashboard.ExpenditurePage.completed',
    defaultMessage: 'Value is required',
  },
  amountZeroError: {
    id: 'dashboard.ExpenditurePage.amountZeroError',
    defaultMessage: 'Value must be greater than zero',
  },
  milestoneNameError: {
    id: 'dashboard.ExpenditurePage.milestoneNameError',
    defaultMessage: 'Name is required',
  },
  milestoneAmountError: {
    id: 'dashboard.ExpenditurePage.milestoneAmountError',
    defaultMessage: 'Amount is required',
  },
});

export const initialValues = {
  expenditure: ExpenditureTypes.Advanced,
  recipients: [newRecipient],
  filteredDomainId: String(ROOT_DOMAIN_ID),
  owner: undefined,
  title: undefined,
  description: undefined,
  staged: {
    milestones: [{ ...initalMilestone, id: nanoid() }],
  },
  split: {
    unequal: false,
    recipients: [
      { ...initalRecipient, key: nanoid() },
      { ...initalRecipient, key: nanoid() },
    ],
  },
  streaming: {
    fundingSources: [newFundingSource],
  },
};

export const validationSchema = yup.object().shape({
  expenditure: yup.string().required(),
  filteredDomainId: yup.string().required(() => MSG.teamRequiredError),
  recipients: yup.array().when('expenditure', {
    is: (expenditure) => expenditure === ExpenditureTypes.Advanced,
    then: yup.array().of(
      yup.object().shape({
        recipient: yup.object().required(),
        value: yup
          .array(
            yup.object().shape({
              amount: yup
                .number()
                .transform((value) => toFinite(value))
                .required(() => MSG.valueError)
                .moreThan(0, () => MSG.amountZeroError),
              tokenAddress: yup.string().required(),
            }),
          )
          .min(1),
      }),
    ),
  }),
  staged: yup.object().when('expenditure', {
    is: (expenditure) => expenditure === ExpenditureTypes.Staged,
    then: yup.object().shape({
      user: yup.object().required(),
      amount: yup.object().shape({
        value: yup
          .number()
          .transform((value) => toFinite(value))
          .required(() => MSG.milestoneAmountError)
          .moreThan(0, () => MSG.amountZeroError),
        tokenAddress: yup.string().required(),
      }),
      milestones: yup
        .array(
          yup.object().shape({
            name: yup.string().required(() => MSG.milestoneNameError),
            percent: yup
              .number()
              .moreThan(0, () => MSG.amountZeroError)
              .required(),
            amount: yup.number(),
          }),
        )
        .min(1)
        .required(),
    }),
  }),
  title: yup.string().min(3).required(),
  description: yup.string().max(4000),
  split: yup.object().when('expenditure', {
    is: (expenditure) => expenditure === ExpenditureTypes.Split,
    then: yup.object().shape({
      unequal: yup.boolean().required(),
      amount: yup.object().shape({
        value: yup
          .number()
          .transform((value) => toFinite(value))
          .required(() => MSG.valueError)
          .moreThan(0, () => MSG.amountZeroError),
        tokenAddress: yup.string().required(),
      }),
      recipients: yup
        .array()
        .of(
          yup.object().shape({
            user: yup.object().required(),
            amount: yup.number().required(),
          }),
        )
        .min(2)
        .required(),
    }),
  }),
});
