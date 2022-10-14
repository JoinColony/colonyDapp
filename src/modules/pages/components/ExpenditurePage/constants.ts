import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import { toFinite } from 'lodash';
import { defineMessages } from 'react-intl';

import { newRecipient } from '~dashboard/ExpenditurePage/Payments/constants';
import { initalRecipient } from '~dashboard/ExpenditurePage/Split/constants';
import { initalMilestone } from '~dashboard/ExpenditurePage/Staged/constants';
import { newFundingSource } from '~dashboard/ExpenditurePage/Streaming/constants';

import { ExpenditureEndDateTypes, ExpenditureTypes } from './types';

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
  zeroError: {
    id: 'dashboard.ExpenditurePage.zeroError',
    defaultMessage: 'Must be greater than zero',
  },
  amountLimitError: {
    id: 'dashboard.ExpenditurePage.amountLimitError',
    defaultMessage: `Value cannot be greater than limit`,
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
    startDate: { date: new Date() },
    endDate: {
      date: new Date(),
      option: ExpenditureEndDateTypes.WhenCancelled,
    },
  },
};

const today = new Date();
today.setHours(0, 0, 0, 0);

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
  streaming: yup.object().when('expenditure', {
    is: (expenditure) => expenditure === ExpenditureTypes.Streaming,
    then: yup.object().shape({
      fundingSources: yup
        .array()
        .of(
          yup.object().shape({
            team: yup.string().required(),
            rate: yup.array().of(
              yup.object().shape({
                amount: yup
                  .number()
                  .transform((value) => toFinite(value))
                  .required(() => MSG.valueError)
                  .moreThan(0, () => MSG.amountZeroError)
                  .when('limit', (limit, schema) =>
                    limit
                      ? schema.max(limit, () => MSG.amountLimitError)
                      : schema,
                  ),
                token: yup.string().required(),
                time: yup.string().required(),
                limit: yup.number().moreThan(0, () => MSG.amountZeroError),
              }),
            ),
          }),
        )
        .min(1),
      user: yup.object().required(),
      startDate: yup.object().shape({
        date: yup.date().required().min(today),
      }),
      endDate: yup.object().when('startDate', (startDate, schema) =>
        schema.shape({
          option: yup.string().required(),
          date: yup.date().when('option', {
            is: (option) => option === ExpenditureEndDateTypes.FixedTime,
            then: yup.date().min(startDate.date).required(),
          }),
        }),
      ),
    }),
  }),
});
