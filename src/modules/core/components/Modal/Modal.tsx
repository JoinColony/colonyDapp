import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';

import styles from './Modal.css';

interface ModalStyles {
  base: string;
  afterOpen: string;
  beforeClose: string;
}

interface Props {
  /** className for the content elemenent */
  className?: string | ModalStyles;

  children: ReactNode;

  cancel?: any;

  isOpen: boolean;

  onRequestClose?: any;

  /** className for the overlay elemenent */
  overlayClassName?: string | ModalStyles;
  // Passing through props for react-modal

  /** Add a role for a11y in dialogs */
  role?: 'dialog';

  /** Boolean indicating if the modal should be focused after render */
  shouldFocusAfterRender?: boolean;

  /** Boolean indicating if the overlay should close the modal */
  shouldCloseOnOverlayClick?: boolean;

  /** Boolean indicating if pressing the esc key should close the modal */
  shouldCloseOnEsc?: boolean;

  /** Boolean indicating if the modal should restore focus to the element that had focus prior to its display. */
  shouldReturnFocusAfterClose?: boolean;
}

const Modal = ({ className, overlayClassName, ...props }: Props) => (
  <ReactModal
    overlayClassName={overlayClassName}
    className={className}
    portalClassName={styles.portal}
    {...props}
  />
);

// We're using defaultProps here as flow seemingly has a problem with destructuring and defaults:
// https://github.com/facebook/flow/issues/183#issuecomment-267274206
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
