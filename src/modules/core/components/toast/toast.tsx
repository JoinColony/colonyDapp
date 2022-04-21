/* eslint-disable react/prop-types */
import React from 'react';
import { toast as reactToast } from 'react-toastify';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from '~types/index';
import Icon from '~core/Icon';

import styles from './toast.css';

const handleMsg = (msg: MessageDescriptor, msgValues?: SimpleMessageValues) => {
  return <FormattedMessage {...msg} values={msgValues} />;
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

const defaultOptions = {
  hideProgressBar: false,
  autoClose: 5000,
};

const toast = {
  success(
    msg: MessageDescriptor,
    msgValues?: SimpleMessageValues,
    options = { ...defaultOptions },
  ) {
    return reactToast.success(handleMsg(msg, msgValues), {
      ...options,
      closeButton: CloseButton,
      icon: SuccessDot,
      className: `${styles.toastifyToastContainerBottomLeft}
      ${styles.toastSuccess}`,
    });
  },
  error(
    msg: MessageDescriptor,
    msgValues?: SimpleMessageValues,
    options = { ...defaultOptions },
  ) {
    return reactToast.error(handleMsg(msg, msgValues), {
      ...options,
      closeButton: CloseButton,
      icon: ErrorDot,
      className: `${styles.toastifyToastContainerBottomLeft}
      ${styles.toastError}`,
    });
  },
};

export default toast;
