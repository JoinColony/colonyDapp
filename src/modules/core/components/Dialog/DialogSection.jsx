/* @flow */

import type { Node } from 'react';

import React from 'react';

import { getMainClasses } from '~utils/css';

import styles from './DialogSection.css';

type Appearance = {
  align?: 'right',
  border?: 'top' | 'bottom' | 'none',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Children to render in this section */
  children?: Node,
};

const DialogSection = ({ appearance, children }: Props) => (
  <section className={getMainClasses(appearance, styles)}>{children}</section>
);

export default DialogSection;
