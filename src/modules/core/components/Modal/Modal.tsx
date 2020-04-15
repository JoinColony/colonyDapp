import React, { FC } from 'react';
import ReactModal, { Props as ModalProps } from 'react-modal';

import styles from './Modal.css';

const Modal: FC<ModalProps> = ({ role = 'dialog', ...props }: ModalProps) => (
  <ReactModal portalClassName={styles.portal} role={role} {...props} />
);

export default Modal;
