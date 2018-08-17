/* @flow */
import React from 'react';

import type { Node } from 'react';
import type { Cancel, Close } from '../Dialog/types';

import Modal from '../Modal';
import Icon from '../Icon';

import styles from './ActivityBar.css';
import modalStyles from '../Modal/Modal.css';

type Props = {
  cancel: Cancel,
  close?: Close,
  children: Node,
  /** Determines if the ActivityBar Modal can be dismissed */
  isDismissable?: boolean,
  /** same as Dialog */
  shouldCloseOnEsc?: boolean,
  /** same as Dialog */
  shouldCloseOnOverlayClick?: boolean,
};

const ActivityBar = ({ children, isDismissable, ...modalProps }: Props) => {
  const { cancel, shouldCloseOnEsc, shouldCloseOnOverlayClick } = modalProps;

  const overlayClassName = {
    base: isDismissable ? modalStyles.overlayInvisible : modalStyles.overlay,
    afterOpen: modalStyles.overlayAfterOpen,
    beforeClose: modalStyles.overlayBeforeClose,
  };

  return (
    <Modal
      {...modalProps}
      role="dialog"
      className={styles.modal}
      onRequestClose={isDismissable ? cancel : () => false}
      shouldCloseOnEsc={isDismissable && shouldCloseOnEsc}
      shouldCloseOnOverlayClick={isDismissable && shouldCloseOnOverlayClick}
      overlayClassName={overlayClassName}
      isOpen
    >
      <div className={styles.main}>
        <div className={styles.content}>{children}</div>
        <div className={styles.control}>
          {isDismissable && (
            <Icon
              role="button"
              name="circle-close"
              title="close"
              onClick={cancel}
              appearance={{ size: 'medium', theme: 'invert' }}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

ActivityBar.defaultProps = {
  isDismissable: true,
};

export default ActivityBar;
