/* eslint-disable react/prop-types */
import React from 'react';
import { toast as reactToast } from 'react-toastify';

import Icon from '~core/Icon';

import styles from './toast.css';

const CloseButton = ({ closeToast }) => {
  return (
    <Icon
      className={styles.closeIcon}
      appearance={{ size: 'medium' }}
      name="circle-close"
      onClick={closeToast}
    />
  );
};

const SuccessDot = () => <div className={styles.successDot} />;
const ErrorDot = () => <div className={styles.errorDot} />;

const toast = {
  success(msg, options = {}) {
    return reactToast.success(msg, {
      ...options,
      hideProgressBar: false,
      autoClose: 3000,
      icon: SuccessDot,
      closeButton: CloseButton,
      className: `${styles.toastifyToastContainerBottomLeft}
      ${styles.toastSuccess}`,
    });
  },
  error(msg, options = {}) {
    return reactToast.error(msg, {
      ...options,
      hideProgressBar: false,
      autoClose: 3000,
      icon: ErrorDot,
      closeButton: CloseButton,
      className: `${styles.toastifyToastContainerBottomLeft}
      ${styles.toastError}`,
    });
  },
};

export default toast;
