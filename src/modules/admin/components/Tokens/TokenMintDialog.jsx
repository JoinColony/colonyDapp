/* @flow */

import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { TokenType } from '~types/token';

import Button from '~core/Button';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';

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
  errorAmountRequired: {
    id: 'admin.Tokens.TokenMintDialog.errorAmountRequired',
    defaultMessage: 'Please enter an amount greater than 0.',
  },
});

type FormValues = {
  mintAmount: string,
};

type Props = {
  cancel: () => void,
  close: () => void,
  nativeToken: TokenType,
};

const validationSchema = yup.object().shape({
  mintAmount: yup
    .number()
    .required(MSG.errorAmountRequired)
    .min(1, MSG.errorAmountMin),
});

class TokenMintDialog extends Component<Props> {
  timeoutId: TimeoutID;

  static displayName = 'admin.Tokens.TokenMintDialog';

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  handleSubmitTokenForm = ({ mintAmount }: FormValues) => {
    const { close } = this.props;
    // TODO handle form data here
    console.log(mintAmount);
    this.timeoutId = setTimeout(() => {
      close();
    }, 500);
  };

  render() {
    const {
      cancel,
      nativeToken: { tokenName, tokenSymbol },
    } = this.props;
    return (
      <Dialog cancel={cancel}>
        <Form
          initialValues={{
            mintAmount: 0,
          }}
          onSubmit={this.handleSubmitTokenForm}
          validationSchema={validationSchema}
        >
          {({
            handleSubmit,
            isSubmitting,
            isValid,
          }: FormikProps<FormValues>) => (
            <Fragment>
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
                      label={MSG.amountLabel}
                      min={0}
                      name="mintAmount"
                      step={10}
                      type="number"
                    />
                  </div>
                  <span className={styles.nativeToken} title={tokenName}>
                    {tokenSymbol}
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
            </Fragment>
          )}
        </Form>
      </Dialog>
    );
  }
}

export default TokenMintDialog;
