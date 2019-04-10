/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import compose from 'lodash/fp/compose';
import moveDecimal from 'move-decimal-point';
import BigNumber from 'bn.js';

import type { TokenType } from '~immutable';
import type { Address } from '~types';

import Button from '~core/Button';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import { ActionForm, Input } from '~core/Fields';
import Heading from '~core/Heading';

import { mergePayload, withKeyPath } from '~utils/actions';
import { ACTIONS } from '~redux';

import styles from './TokenMintDialog.css';

const MSG = defineMessages({
  title: {
    id: 'admin.Tokens.TokenMintDialog.dialogTitle',
    defaultMessage: 'Mint new tokens',
  },
  descriptionText: {
    id: 'admin.Tokens.TokenMintDialog.descriptionText',
    defaultMessage: `The tokens you mint can be assigned to tasks.
      Only the Colony Owner can mint new tokens.`,
  },
  amountLabel: {
    id: 'admin.Tokens.TokenMintDialog.amountLabel',
    defaultMessage: 'Amount',
  },
  buttonCancel: {
    id: 'admin.Tokens.TokenMintDialog.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonConfirm: {
    id: 'admin.Tokens.TokenMintDialog.buttonConfirm',
    defaultMessage: 'Confirm',
  },
  errorAmountMin: {
    id: 'admin.Tokens.TokenMintDialog.errorAmountMin',
    defaultMessage: 'Please enter an amount greater than 0.',
  },
  errorAmountNumeral: {
    id: 'admin.Tokens.TokenMintDialog.errorAmountNumeral',
    defaultMessage: 'Please enter a number.',
  },
  errorAmountRequired: {
    id: 'admin.Tokens.TokenMintDialog.errorAmountRequired',
    defaultMessage: 'Please enter an amount.',
  },
});

type FormValues = {
  mintAmount: number,
};

type Props = {|
  cancel: () => void,
  close: () => void,
  nativeToken: TokenType,
  colonyAddress: Address,
|};

const validationSchema = yup.object().shape({
  mintAmount: yup
    .number(MSG.errorAmountNumeral)
    .required(MSG.errorAmountRequired)
    .min(0.000000000000000001, MSG.errorAmountMin),
});

const transformMintAmount = (decimals?: number, colonyAddress: Address) => ({
  payload: { amount: inputAmount, ...payload },
  meta,
  ...action
}) => {
  // shift by the token's decimals (or default of 18)
  const amountNum = moveDecimal(
    inputAmount,
    decimals ? parseInt(decimals, 10) : 18,
  );
  const amount = new BigNumber(amountNum);
  const payloadWithAmount = {
    ...action,
    payload: {
      ...payload,
      amount,
    },
    meta: {
      ...meta,
    },
  };
  return compose(
    withKeyPath(colonyAddress),
    mergePayload({ colonyAddress }),
  )(payloadWithAmount);
};

const TokenMintDialog = ({
  cancel,
  close,
  nativeToken: { name, symbol, decimals },
  colonyAddress,
}: Props) => (
  <Dialog cancel={cancel}>
    <ActionForm
      initialValues={{
        mintAmount: 0,
      }}
      onSubmit={close}
      onSuccess={close}
      validationSchema={validationSchema}
      submit={ACTIONS.COLONY_MINT_TOKENS}
      error={ACTIONS.COLONY_MINT_TOKENS_ERROR}
      success={ACTIONS.COLONY_MINT_TOKENS_SUCCESS}
      transform={transformMintAmount(decimals, colonyAddress)}
    >
      {({ handleSubmit, isSubmitting, isValid }: FormikProps<FormValues>) => (
        <>
          <DialogSection>
            <Heading
              appearance={{ size: 'medium', margin: 'none' }}
              text={MSG.title}
            />
          </DialogSection>
          <DialogSection>
            <Heading
              appearance={{
                margin: 'double',
                size: 'normal',
                weight: 'thin',
              }}
              text={MSG.descriptionText}
            />
            <div className={styles.inputContainer}>
              <div className={styles.input}>
                <Input
                  appearance={{ theme: 'minimal' }}
                  formattingOptions={{
                    numeral: true,
                    numeralPositiveOnly: true,
                    numeralDecimalScale: decimals || 18,
                  }}
                  label={MSG.amountLabel}
                  name="mintAmount"
                />
              </div>
              <span className={styles.nativeToken} title={name}>
                {symbol}
              </span>
            </div>
          </DialogSection>
          <DialogSection appearance={{ align: 'right' }}>
            <Button
              appearance={{ theme: 'secondary', size: 'large' }}
              onClick={cancel}
              text={MSG.buttonCancel}
            />
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              onClick={handleSubmit}
              text={MSG.buttonConfirm}
              loading={isSubmitting}
              disabled={!isValid}
            />
          </DialogSection>
        </>
      )}
    </ActionForm>
  </Dialog>
);

TokenMintDialog.displayName = 'admin.Tokens.TokenMintDialog';

export default TokenMintDialog;
