import React from 'react';

import Textarea, { TextareaComponentProps } from '../Textarea';

import styles from './Annotations.css';

const Annotations = (props: TextareaComponentProps) => (
  <div className={styles.container}>
    <Textarea {...props} />
  </div>
);

Annotations.displayName = 'Annotations';

export default Annotations;
