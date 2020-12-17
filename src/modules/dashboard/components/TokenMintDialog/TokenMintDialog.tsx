import { FormikProps } from 'formik';
import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import Dialog, { DialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations, Input } from '~core/Fields';
import Heading from '~core/Heading';
import { Colony } from '~data/index';
import { Address } from '~types/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { WizardDialogType } from '~utils/hooks';


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

interface CustomWizardDialogProps {
  prevStep?: string;
  colony: Colony;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'dashboard.TokenMintDialog';

const TokenMintDialog = ({
  colony: { nativeTokenAddress, tokens = [], colonyAddress, colonyName },
  cancel,
  close,
  callStep,
  prevStep,
}: Props) => {

  const nativeToken =
    tokens && tokens.find(({ address }) => address === nativeTokenAddress);

  const {name, symbol, decimals} = nativeToken;
  return (
    <Dialog cancel={cancel}>
      <TokenMintForm
        colonyAddress={colonyAddress}
        colonyName={colonyName}
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
                <Annotations label={MSG.justificationLabel} name="annotation" />
              </div>
            </DialogSection>
            <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                onClick={prevStep && callStep ? () => callStep(prevStep) : undefined}
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
  )
};

TokenMintDialog.displayName = displayName;

export default TokenMintDialog;
