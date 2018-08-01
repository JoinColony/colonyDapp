/* @flow */

import React from 'react';
import type { Node } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './FieldSet.css';

const displayName = 'Fieldset';

type Appearance = {
  align: 'right',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Children to render */
  children: Node,
};

const FieldSet = ({ appearance, children }: Props) => (
  <fieldset className={getMainClasses(appearance, styles)}>{children}</fieldset>
);

FieldSet.displayName = displayName;

export default FieldSet;
