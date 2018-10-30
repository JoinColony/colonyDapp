/* @flow */

import type { Node } from 'react';

import React from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~core/Icon';

import styles from './Dialog.css';

import Modal from '../Modal';

const MSG = defineMessages({
  buttonCancel: {
    id: 'core.Dialog.buttonCancel',
    defaultMessage: 'Cancel',
  },
});

type ModalStyles = {
  base: string,
  afterOpen: string,
  beforeClose: string,
};

type Props = {
  /** Dialog needs the cancel function from your Dialog component */
  cancel: () => void,
  /** Children to render in this Dialog */
  children: Node,
  /** Occasionally the dialog needs special styles */
  className?: ModalStyles,
  /** optional styles for overlay that appears behind modal, default is a transparent grey,
   * but occasionaly we need specific styles for that */
  backdrop?: ModalStyles,
  /** Determines if the Dialog can be dismissed */
  isDismissable?: boolean,
};

const Dialog = ({
  children,
  cancel,
  backdrop,
  className,
  isDismissable = true,
  ...props
}: Props) => (
  <Modal
    {...props}
    role="dialog"
    className={styles.modal}
    overlayClassName={backdrop}
    onRequestClose={cancel}
    isOpen
  >
    {isDismissable && (
      <div className={styles.dialogOuterActions}>
        <button
          type="button"
          className={styles.closeIconButton}
          onClick={cancel}
        >
          <Icon name="circle-close" title={MSG.buttonCancel} />
        </button>
      </div>
    )}
    <div className={className || styles.main}>{children}</div>
  </Modal>
);

export default Dialog;
