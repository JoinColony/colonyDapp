import React, { FC } from 'react';
import ReactModal, { Props as ModalProps } from 'react-modal';

import styles from './Modal.css';

const Modal: FC<ModalProps> = ({ role = 'dialog', ...props }: ModalProps) => (
  <ReactModal portalClassName={styles.portal} role={role} {...props} />
);

Modal.defaultProps = {
  className: {
    base: styles.main,
    afterOpen: styles.mainAfterOpen,
    beforeClose: styles.mainBeforeClose,
  },
  overlayClassName: {
    base: styles.overlay,
    afterOpen: styles.overlayAfterOpen,
    beforeClose: styles.overlayBeforeClose,
  },
  role: 'dialog',
  shouldFocusAfterRender: true,
  shouldCloseOnOverlayClick: true,
  shouldCloseOnEsc: true,
  shouldReturnFocusAfterClose: true,
};

export default Modal;
