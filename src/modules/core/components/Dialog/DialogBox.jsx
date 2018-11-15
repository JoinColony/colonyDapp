/* @flow */

import React from 'react';

import type { Node } from 'react';

import styles from './DialogBox.css';

type Props = {
  /** Children to render in this Dialog */
  children: Node,
};

const DialogBox = ({ children }: Props) => (
  <div className={styles.dialogBox}>{children}</div>
);

export default DialogBox;
