/* @flow */

import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import type { TokenType } from '~types/token';

import ConfirmDialog from '~core/Dialog/ConfirmDialog.jsx';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';

import styles from './TokenMintDialog.css';

const MSG = defineMessages({
  dialogTitle: {
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
  buttonConfirm: {
    id: 'admin.Tokens.TokenMintDialog.buttonConfirm',
    defaultMessage: 'Confirm',
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

class TokenMintDialog extends Component<Props> {
  static displayName = 'admin.Tokens.TokenMintDialog';

  handleSubmitTokenForm = ({ mintAmount }: FormValues) => {
    const { close } = this.props;
    // TODO handle form data here
    console.log(mintAmount);
    close();
  };

  render() {
    const {
      cancel,
      nativeToken: { tokenName, tokenSymbol },
    } = this.props;
    return (
      <Form
        initialValues={{
          mintAmount: null,
        }}
        onSubmit={this.handleSubmitTokenForm}
      >
        {({ handleSubmit }: FormikProps<FormValues>) => (
          <ConfirmDialog
            cancel={cancel}
            close={handleSubmit}
            confirmButtonText={MSG.buttonConfirm}
            heading={MSG.dialogTitle}
          >
            <Fragment>
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
            </Fragment>
          </ConfirmDialog>
        )}
      </Form>
    );
  }
}

export default TokenMintDialog;
