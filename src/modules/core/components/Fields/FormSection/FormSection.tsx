import React, { ReactNode } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './FormSection.css';

export interface Appearance {
  align?: 'center' | 'right';
  border?: 'top' | 'bottom' | 'none';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Children to render in this section */
  children?: ReactNode;
}

const FormSection = ({ appearance, children }: Props) => (
  <section className={getMainClasses(appearance, styles)}>{children}</section>
);

export default FormSection;
