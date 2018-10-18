/* @flow */
import type { FormikProps } from 'formik';

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { TokenType } from '~types/token';

import ConfirmDialog from '~core/Dialog/ConfirmDialog.jsx';
import { Checkbox, Form, InputLabel } from '~core/Fields';
import Heading from '~core/Heading';

import styles from './TokenEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'admin.Tokens.TokenEditDialog.title',
    defaultMessage: 'Add Token',
  },
  instructionText: {
    id: 'admin.Tokens.TokenEditDialog.instructionText',
    defaultMessage: 'Please select from these ERC20 tokens.',
  },
  fieldLabel: {
    id: 'admin.Tokens.TokenEditDialog.fieldLabel',
    defaultMessage: 'Add Tokens',
  },
  buttonConfirm: {
    id: 'admin.Tokens.EditTokensModal.buttonConfirm',
    defaultMessage: 'Confirm',
  },
});

type FormValues = {
  colonyTokens: Array<string>,
};

type Props = {
  cancel: () => void,
  close: () => void,
  tokens: Array<TokenType>,
};

class TokenEditDialog extends Component<Props> {
  static displayName = 'admin.Tokens.TokenEditDialog';

  static defaultProps = {
    tokens: [],
  };

  handleSubmitTokenForm = ({ colonyTokens }: FormValues) => {
    const { close } = this.props;
    // TODO handle form value submission
    console.log(colonyTokens);
    close();
  };

  render() {
    const { tokens, cancel } = this.props;
    return (
      <Form
        initialValues={{
          colonyTokens: tokens
            .filter(token => token.isEnabled || token.isNative)
            .map(token => token.tokenSymbol),
        }}
        onSubmit={this.handleSubmitTokenForm}
      >
        {({ handleSubmit }: FormikProps<FormValues>) => (
          <ConfirmDialog
            cancel={cancel}
            close={handleSubmit}
            confirmButtonText={MSG.buttonConfirm}
            heading={MSG.title}
          >
            <Heading
              text={MSG.instructionText}
              appearance={{ size: 'normal', weight: 'thin' }}
            />
            <InputLabel label={MSG.fieldLabel} />
            <div className={styles.tokenChoiceContainer}>
              {tokens.map(token => (
                <Checkbox
                  className={styles.tokenChoice}
                  key={token.id}
                  value={token.tokenSymbol}
                  name="colonyTokens"
                  disabled={token.isNative}
                >
                  {!!token.tokenIcon && (
                    <img
                      src={token.tokenIcon}
                      alt={token.tokenName}
                      className={styles.tokenChoiceIcon}
                    />
                  )}
                  <span className={styles.tokenChoiceSymbol}>
                    <Heading
                      text={token.tokenSymbol}
                      appearance={{ size: 'small', margin: 'none' }}
                    />
                    {token.tokenName}
                  </span>
                </Checkbox>
              ))}
            </div>
          </ConfirmDialog>
        )}
      </Form>
    );
  }
}

export default TokenEditDialog;
