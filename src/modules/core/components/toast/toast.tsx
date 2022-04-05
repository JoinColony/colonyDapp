/* eslint-disable react/prop-types */
import React from 'react';
import { toast as reactToast } from 'react-toastify';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Icon from '~core/Icon';

import styles from './toast.css';

const handleMsg = (msg: MessageDescriptor) => {
  return <FormattedMessage {...msg} />;
};

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
    return reactToast.success(handleMsg(msg), {
      ...options,
      hideProgressBar: false,
      autoClose: 5000,
      closeButton: CloseButton,
      icon: SuccessDot,
      className: `${styles.toastifyToastContainerBottomLeft}
      ${styles.toastSuccess}`,
    });
  },
  error(msg, options = {}) {
    return reactToast.error(handleMsg(msg), {
      ...options,
      hideProgressBar: false,
      autoClose: 5000,
      closeButton: CloseButton,
      icon: ErrorDot,
      className: `${styles.toastifyToastContainerBottomLeft}
      ${styles.toastError}`,
    });
  },
};

export default toast;
