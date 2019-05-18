/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';

import type { TokenType } from '~immutable';
import type { Address } from '~types';

import Button from '~core/Button';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import { Input } from '~core/Fields';
import Heading from '~core/Heading';

import TokenMintForm from './TokenMintForm.jsx';

import styles from '~admin/Tokens/TokenMintDialog.css';

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
});

type FormValues = {|
  mintAmount: number,
|};

type Props = {|
  cancel: () => void,
  close: () => void,
  nativeToken: TokenType,
  colonyAddress: Address,
|};

const TokenMintDialog = ({
  colonyAddress,
  cancel,
  close,
  nativeToken: { name, symbol, decimals },
  nativeToken,
}: Props) => (
  <Dialog cancel={cancel}>
    <TokenMintForm
      colonyAddress={colonyAddress}
      nativeToken={nativeToken}
      onSuccess={close}
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
    </TokenMintForm>
  </Dialog>
);

TokenMintDialog.displayName = 'admin.Tokens.TokenMintDialog';

export default TokenMintDialog;
