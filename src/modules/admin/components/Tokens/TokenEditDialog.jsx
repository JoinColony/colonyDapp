/* @flow */
import type { FormikProps } from 'formik';

import React, { Component, Fragment } from 'react';
import { List } from 'immutable';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { TokenRecord } from '~types';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
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
  buttonCancel: {
    id: 'admin.Tokens.EditTokensModal.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonConfirm: {
    id: 'admin.Tokens.EditTokensModal.buttonConfirm',
    defaultMessage: 'Confirm',
  },
  errorNativeTokenRequired: {
    id: 'admin.Tokens.EditTokensModal.errorNativeTokenRequired',
    defaultMessage: 'The native token must be selected.',
  },
});

type FormValues = {
  colonyTokens: Array<string>,
};

type Props = {
  cancel: () => void,
  close: () => void,
  tokens: List<TokenRecord>,
  /* We need to be aware of who own the tokens since it changes the UI */
  tokenOwner: 'Colony' | 'User',
};

const validateNativeTokenSelect = (nativeToken?: TokenRecord): any => {
  if (nativeToken) {
    const { symbol } = nativeToken;
    return yup.object().shape({
      colonyTokens: yup
        .array()
        .of(yup.string())
        .includes(symbol, MSG.errorNativeTokenRequired),
    });
  }
  return null;
};

class TokenEditDialog extends Component<Props> {
  timeoutId: TimeoutID;

  static displayName = 'admin.Tokens.TokenEditDialog';

  static defaultProps = {
    tokens: [],
  };

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  // eslint-disable-next-line no-unused-vars
  handleSubmitTokenForm = ({ colonyTokens }: FormValues) => {
    const { close } = this.props;
    // TODO handle form value submission
    this.timeoutId = setTimeout(() => {
      close();
    }, 500);
  };

  render() {
    const { tokens, cancel, tokenOwner } = this.props;
    const nativeToken = tokens.find(token => token.isNative);
    return (
      <Dialog cancel={cancel}>
        <Form
          initialValues={{
            colonyTokens: tokens
              .filter(token => token.isEnabled || token.isNative)
              .map(token => token.symbol),
          }}
          onSubmit={this.handleSubmitTokenForm}
          validationSchema={validateNativeTokenSelect(nativeToken)}
        >
          {({ isSubmitting }: FormikProps<FormValues>) => (
            <Fragment>
              <DialogSection>
                <Heading
                  appearance={{ size: 'medium', margin: 'none' }}
                  text={MSG.title}
                />
              </DialogSection>
              <DialogSection>
                <Heading
                  text={MSG.instructionText}
                  appearance={{ size: 'normal', weight: 'thin' }}
                />
                <InputLabel label={MSG.fieldLabel} />
                <div className={styles.tokenChoiceContainer}>
                  {tokens.map(
                    ({ id, symbol, isNative, name, icon, isBlocked }) => (
                      <Checkbox
                        className={styles.tokenChoice}
                        key={id}
                        value={symbol}
                        name="colonyTokens"
                        disabled={
                          tokenOwner === 'Colony' ? isNative : isBlocked
                        }
                      >
                        {!!icon && (
                          <img
                            src={icon}
                            alt={name}
                            className={styles.tokenChoiceIcon}
                          />
                        )}
                        <span className={styles.tokenChoiceSymbol}>
                          <Heading
                            text={symbol}
                            appearance={{ size: 'small', margin: 'none' }}
                          />
                          {name}
                        </span>
                      </Checkbox>
                    ),
                  )}
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
                  loading={isSubmitting}
                  text={MSG.buttonConfirm}
                  type="submit"
                />
              </DialogSection>
            </Fragment>
          )}
        </Form>
      </Dialog>
    );
  }
}

export default TokenEditDialog;
