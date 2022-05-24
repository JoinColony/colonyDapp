import React, { ReactNode } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './DialogSection.css';

interface Appearance {
  theme?: 'heading' | 'sidePadding' | 'footer';
  align?: 'center' | 'right';
  border?: 'top' | 'bottom' | 'none';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Children to render in this section */
  children?: ReactNode;
}

const DialogSection = ({ appearance, children }: Props) => (
  <section className={getMainClasses(appearance, styles)}>{children}</section>
);

export default DialogSection;
