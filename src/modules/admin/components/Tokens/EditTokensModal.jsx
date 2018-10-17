/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { TokenType } from '~types/token';

import Button from '~core/Button';
import { Checkbox, Form, InputLabel } from '~core/Fields';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Modal from '~core/Modal';

import styles from './EditTokensModal.css';

const MSG = defineMessages({
  closeIconTitle: {
    id: 'admin.Tokens.EditTokensModal.closeIconTitle',
    defaultMessage: 'Close',
  },
  title: {
    id: 'admin.Tokens.EditTokensModal.title',
    defaultMessage: 'Add Token',
  },
  instructionText: {
    id: 'admin.Tokens.EditTokensModal.instructionText',
    defaultMessage: 'Please select from these ERC20 tokens.',
  },
  fieldLabel: {
    id: 'admin.Tokens.EditTokensModal.fieldLabel',
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
});

type Props = {
  closeModal: () => void,
  isOpen: boolean,
  tokens: Array<TokenType>,
};

const tokenChoicesFieldName = 'colonyTokens';

const displayName = 'admin.Tokens.EditTokensModal';

const EditTokensModal = ({ isOpen, tokens, closeModal }: Props) => (
  <Modal isOpen={isOpen}>
    <div className={styles.modalOuterActions}>
      <button
        type="button"
        className={styles.closeIconButton}
        onClick={closeModal}
      >
        <Icon name="circle-close" title={MSG.closeIconTitle} />
      </button>
    </div>
    <div className={styles.modalContent}>
      <Form
        initialValues={{
          [tokenChoicesFieldName]: tokens
            .filter(token => token.isEnabled || token.isNative)
            .map(token => token.tokenSymbol),
        }}
        onSubmit={console.log}
      >
        <Heading text={MSG.title} appearance={{ size: 'normal' }} />
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
              name={tokenChoicesFieldName}
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
        <div className={styles.modalFooter}>
          <Button
            appearance={{ theme: 'secondary', size: 'large' }}
            text={MSG.buttonCancel}
            onClick={closeModal}
          />
          <Button
            appearance={{ theme: 'primary', size: 'large' }}
            text={MSG.buttonConfirm}
            type="submit"
          />
        </div>
      </Form>
    </div>
  </Modal>
);

EditTokensModal.displayName = displayName;

export default EditTokensModal;
