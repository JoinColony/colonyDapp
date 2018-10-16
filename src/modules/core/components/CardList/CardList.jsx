/* @flow */
import type { ChildrenArray, Element as ElementType } from 'react';

import React from 'react';

import { getMainClasses } from '~utils/css';

import styles from './CardList.css';

type ValidCols = 'auto' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type Appearance = {
  /** Number of columns the grid should contain at its widest (read: max number of columns). Should be auto, or between 2 and 9 (inclusive). Default is `auto`. */
  numCols: ValidCols,
};

type Props = {
  appearance?: Appearance,
  children: ChildrenArray<ElementType<*>>,
  className?: string,
};

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

export default CardList;
