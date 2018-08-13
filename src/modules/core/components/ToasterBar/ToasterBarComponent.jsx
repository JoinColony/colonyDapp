/* @flow */
import React from 'react';
import styles from './ToasterBar.css';

type Props = {
  children: Node,
};

const ToasterBarComponent = ({ children }: Props) => (
  <div className={styles.component}>{children}</div>
);

export default ToasterBarComponent;
