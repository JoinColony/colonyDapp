import React, { ReactNode } from 'react';
import cx from 'classnames';

import { getMainClasses } from '~utils/css';

import styles from './FieldSet.css';

const displayName = 'Fieldset';

interface Appearance {
  align: 'right';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Children to render */
  children: ReactNode;

  /** Optional className */
  className?: string;
}

const FieldSet = ({ appearance, children, className }: Props) => (
  <fieldset className={cx(getMainClasses(appearance, styles), className)}>
    {children}
  </fieldset>
);

FieldSet.displayName = displayName;

export default FieldSet;
