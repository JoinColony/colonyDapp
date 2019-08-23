import React, { ReactNode } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './CardList.css';

type ValidCols = 'auto' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

interface Appearance {
  /** Number of columns the grid should contain at its widest (read: max number of columns). Should be auto, or between 1 and 9 (inclusive). Default is `auto`. */
  numCols: ValidCols;
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Child content to render in the list */
  children: ReactNode;

  /** Optional additional className for further styling */
  className?: string;
}

const displayName = 'CardList';

const CardList = ({
  appearance = { numCols: 'auto' },
  children,
  className,
  ...props
}: Props) => {
  const mainClass = getMainClasses(appearance, styles);
  const classNames = className ? `${mainClass} ${className}` : mainClass;
  return (
    <ul className={classNames} {...props}>
      {children}
    </ul>
  );
};

CardList.displayName = displayName;

export default CardList;
