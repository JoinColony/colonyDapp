import React, { HTMLAttributes } from 'react';

import styles from './Paragraph.css';

const displayName = 'Paragraph';

const Paragraph = ({
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) => {
  const classNames = className ? `${styles.main} ${className}` : styles.main;
  return <p className={classNames} {...rest} />;
};

Paragraph.displayName = displayName;

export default Paragraph;
