/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { TokenType } from '~types/token';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
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
  isOpen: boolean,
  tokens: Array<TokenType>,
};

const displayName = 'admin.ColonyTokens.EditTokensModal';

const EditTokensModal = ({ isOpen, tokens }: Props) => (
  <Modal isOpen={isOpen}>
    <div className={styles.modalOuterActions}>
      <button type="button" className={styles.closeIconButton}>
        <Icon name="circle-close" title={MSG.closeIconTitle} />
      </button>
    </div>
    <div className={styles.modalContent}>
      <Heading text={MSG.title} appearance={{ size: 'normal' }} />
      <Heading text={MSG.instructionText} appearance={{ size: 'small' }} />
      <ul>
        {tokens.map(token => (
          <li className={styles.tokenChoice} key={token.tokenSymbol}>
            {!!token.tokenIcon && (
              <img
                src={token.tokenIcon.data}
                alt={token.tokenIcon.name}
                className={styles.tokenChoiceIcon}
              />
            )}
            {token.tokenSymbol}
          </li>
        ))}
      </ul>
      <div className={styles.modalFooter}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          text={MSG.buttonCancel}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.buttonConfirm}
        />
      </div>
    </div>
  </Modal>
);

EditTokensModal.displayName = displayName;

export default EditTokensModal;
