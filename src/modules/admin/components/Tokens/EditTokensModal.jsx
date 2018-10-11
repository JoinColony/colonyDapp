/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import { Formik, Form } from 'formik';

import type { TokenType } from '~types/token';

import Button from '~core/Button';
import Checkbox from '~core/Fields/Checkbox';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import InputLabel from '~core/Fields/InputLabel';
import Modal from '~core/Modal';

import styles from './EditTokensModal.css';

const MSG = defineMessages({
  closeIconTitle: {
    id: 'admin.ColonyTokens.EditTokensModal.closeIconTitle',
    defaultMessage: 'Close',
  },
  title: {
    id: 'admin.ColonyTokens.EditTokensModal.title',
    defaultMessage: 'Add Token',
  },
  instructionText: {
    id: 'admin.ColonyTokens.EditTokensModal.instructionText',
    defaultMessage: 'Please select from these ERC20 tokens.',
  },
  fieldLabel: {
    id: 'admin.ColonyTokens.EditTokensModal.fieldLabel',
    defaultMessage: 'Add Tokens',
  },
  buttonCancel: {
    id: 'admin.ColonyTokens.EditTokensModal.buttonCancel',
    defaultMessage: 'Cancel',
  },
  buttonConfirm: {
    id: 'admin.ColonyTokens.EditTokensModal.buttonConfirm',
    defaultMessage: 'Confirm',
  },
});

type Props = {
  closeModal: () => void,
  isOpen: boolean,
  tokens: Array<TokenType>,
};

const tokenChoicesFieldName = 'colonyTokens';

const displayName = 'admin.ColonyTokens.EditTokensModal';

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
      <Formik
        initialValues={{
          [tokenChoicesFieldName]: tokens
            .filter(token => token.isEnabled || token.isNative)
            .map(token => token.tokenSymbol),
        }}
        onSubmit={console.log}
      >
        {() => (
          <Form>
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
        )}
      </Formik>
    </div>
  </Modal>
);

EditTokensModal.displayName = displayName;

export default EditTokensModal;
