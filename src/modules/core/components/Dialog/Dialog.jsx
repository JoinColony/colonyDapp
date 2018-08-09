/* @flow */

import type { Node } from 'react';

import React from 'react';

import styles from './Dialog.css';

import Modal from '../Modal';

type Props = {
  /** Dialog needs the cancel function from your Dialog component */
  cancel: () => void,
  /** Children to render in this Dialog */
  children: Node,
};

const Dialog = ({ children, cancel, ...props }: Props) => (
  <Modal
    {...props}
    role="dialog"
    className={styles.modal}
    onRequestClose={cancel}
    isOpen
  >
    <div className={styles.main}>{children}</div>
  </Modal>
);

export default Dialog;
