/* @flow */

import React from 'react';
import ReactModal from 'react-modal';

import styles from './Modal.css';

const Modal = ({ children }) => (
  <ReactModal
    isOpen
    overlayClassName={{
      base: styles.overlay,
      afterOpen: styles.overlayAfterOpen,
      beforeClose: styles.overlayBeforeClose,
    }}
    className={{
      base: styles.main,
      afterOpen: styles.mainAfterOpen,
      beforeClose: styles.mainBeforeClose,
    }}
    portalClassName={styles.portal}
  >
    {children}
  </ReactModal>
);

export default Modal;
