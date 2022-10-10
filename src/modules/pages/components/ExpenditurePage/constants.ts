import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import { isEmpty, toFinite } from 'lodash';
import { defineMessages } from 'react-intl';

import { newRecipient } from '~dashboard/ExpenditurePage/Payments/constants';
import { initalRecipient } from '~dashboard/ExpenditurePage/Split/constants';
import { initalMilestone } from '~dashboard/ExpenditurePage/Staged/constants';
import { isBatchPaymentType } from '~dashboard/ExpenditurePage/Batch/utils';
import { newFundingSource } from '~dashboard/ExpenditurePage/Streaming/constants';

import { ExpenditureEndDateTypes, ExpenditureTypes } from './types';

export const FIX_TRIGGER_EVENT_NAME = 'fix-trigger';

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
  nameError: {
    id: 'dashboard.ExpenditurePage.nameError',
    defaultMessage: 'Name is required',
  },
  amountError: {
    id: 'dashboard.ExpenditurePage.amountError',
    defaultMessage: 'Amount is required',
  },
  fileError: {
    id: 'dashboard.ExpenditurePage.fileError',
    defaultMessage: `File structure is incorrect, try again using the template.`,
  },
  requiredError: {
    id: 'dashboard.ExpenditurePage.requiredError',
    defaultMessage: `Data is required.`,
  },
  zeroError: {
    id: 'dashboard.ExpenditurePage.zeroError',
    defaultMessage: 'Must be greater than zero',
  },
  amountLimitError: {
    id: 'dashboard.ExpenditurePage.amountLimitError',
    defaultMessage: `Value cannot be greater than limit`,
  },
  limitError: {
    id: 'dashboard.ExpenditurePage.limitError',
    defaultMessage: 'Limit is required',
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
      { ...initalRecipient, id: nanoid() },
      { ...initalRecipient, id: nanoid() },
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
          .array()
          .of(
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
          .required(() => MSG.amountError)
          .moreThan(0, () => MSG.amountZeroError),
        tokenAddress: yup.string().required(),
      }),
      milestones: yup
        .array(
          yup.object().shape({
            name: yup.string().required(() => MSG.nameError),
            percent: yup
              .number()
              .moreThan(0, () => MSG.amountZeroError)
              .required(),
            amount: yup.object().shape({
              value: yup.number(),
              tokenAddress: yup.string().required(),
            }),
          }),
        )
        .min(1)
        .required(),
    }),
  }),
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
            amount: yup.object().shape({
              value: yup.number().moreThan(0, () => MSG.amountZeroError),
              tokenAddress: yup.string().required(),
            }),
          }),
        )
        .min(2),
    }),
  }),
  batch: yup.object().when('expenditure', {
    is: (expenditure) => expenditure === ExpenditureTypes.Batch,
    then: yup
      .object()
      .shape({
        dataCSVUploader: yup
          .array()
          .of(
            yup.object().shape({
              parsedData: yup
                .array()
                .min(1, () => MSG.fileError)
                .max(400, () => MSG.amountError)
                .test(
                  'valid-payment',
                  () => MSG.fileError,
                  (value) =>
                    isEmpty(
                      value?.filter(
                        (payment: string) => !isBatchPaymentType(payment),
                      ),
                    ),
                ),
            }),
          )
          .required(() => MSG.requiredError),
        recipients: yup.number().moreThan(0),
        value: yup.array().min(1),
      })
      .required(() => MSG.fileError),
  }),
  streaming: yup.object().when('expenditure', {
    is: (expenditure) => expenditure === ExpenditureTypes.Streaming,
    then: yup.object().shape({
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
      fundingSources: yup
        .array()
        .when('endDate', (endDate, schema) =>
          schema.of(
            yup.object().shape({
              team: yup.string().required(),
              rates: yup.array().of(
                yup.object().shape({
                  amount: yup
                    .number()
                    .transform((value) => toFinite(value))
                    .required(() => MSG.valueError)
                    .moreThan(0, () => MSG.amountZeroError)
                    .when('limit', (limit, rateSchema) =>
                      limit &&
                      endDate.option === ExpenditureEndDateTypes.LimitIsReached
                        ? rateSchema.max(limit, () => MSG.amountLimitError)
                        : rateSchema,
                    ),
                  token: yup.string().required(),
                  time: yup.string().required(),
                  limit: yup
                    .number()
                    .transform((value) => toFinite(value))
                    .when('endDate', (_, limitSchema) =>
                      endDate.option === ExpenditureEndDateTypes.LimitIsReached
                        ? limitSchema
                            .required(() => MSG.limitError)
                            .moreThan(0, () => MSG.amountZeroError)
                        : limitSchema,
                    ),
                }),
              ),
            }),
          ),
        )
        .min(1),
    }),
  }),
  title: yup.string().min(3).required(),
  description: yup.string().max(4000),
});
