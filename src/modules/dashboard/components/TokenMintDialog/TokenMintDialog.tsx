import { FormikProps } from 'formik';
import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Input, Textarea } from '~core/Fields';
import Heading from '~core/Heading';
import { ColonyTokens } from '~data/index';
import { Address } from '~types/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import TokenMintForm from './TokenMintForm';

import styles from './TokenMintDialog.css';

const MSG = defineMessages({
  title: {
    id: 'admin.Tokens.TokenMintDialog.dialogTitle',
    defaultMessage: 'Mint new tokens',
  },
  amountLabel: {
    id: 'admin.Tokens.TokenMintDialog.amountLabel',
    defaultMessage: 'Amount',
  },
  justificationLabel: {
    id: 'admin.Tokens.TokenMintDialog.amountLabel',
    defaultMessage: `Explain why you're minting more tokens (optional)`,
  },
});

interface FormValues {
  justification: string;
  mintAmount: number;
}

interface Props {
  cancel: () => void;
  close: () => void;
  nativeToken: ColonyTokens[0];
  colonyAddress: Address;
}

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
          <DialogSection appearance={{ theme: 'heading' }}>
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
          </DialogSection>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.inputContainer}>
              <div className={styles.inputComponent}>
                <Input
                  appearance={{ theme: 'minimal' }}
                  formattingOptions={{
                    numeral: true,
                    numeralPositiveOnly: true,
                    numeralDecimalScale: getTokenDecimalsWithFallback(decimals),
                  }}
                  label={MSG.amountLabel}
                  name="mintAmount"
                />
              </div>
              <span className={styles.nativeToken} title={name || undefined}>
                {symbol}
              </span>
            </div>
          </DialogSection>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.annotation}>
              <Textarea
                appearance={{
                  colorSchema: 'grey',
                  resizable: 'vertical',
                }}
                label={MSG.justificationLabel}
                name="annotation"
                maxLength={4000}
              />
            </div>
          </DialogSection>
          <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
            <Button
              appearance={{ theme: 'secondary', size: 'large' }}
              onClick={cancel}
              text={{ id: 'button.back' }}
            />
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              onClick={() => handleSubmit()}
              text={{ id: 'button.confirm' }}
              loading={isSubmitting}
              disabled={!isValid}
              style={{ width: styles.wideButton }}
            />
          </DialogSection>
        </>
      )}
    </TokenMintForm>
  </Dialog>
);

TokenMintDialog.displayName = 'admin.Tokens.TokenMintDialog';

export default TokenMintDialog;
