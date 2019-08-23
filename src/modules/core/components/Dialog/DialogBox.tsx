import React, { ReactNode } from 'react';

import styles from './DialogBox.css';

interface Props {
  /** Children to render in this Dialog */
  children: ReactNode;
}

const DialogBox = ({ children }: Props) => (
  <div className={styles.dialogBox}>{children}</div>
);

export default DialogBox;
