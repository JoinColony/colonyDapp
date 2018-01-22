/* @flow */

import React from 'react';
import type { Node } from 'react';

import type { Appearance } from '~types/css';
import { getMainClasses } from '~utils/css';

import styles from './FieldSet.css';

const displayName = 'core.Fields.Fieldset';

type Props = {
  appearance?: Appearance,
  children: Node,
};

const FieldSet = ({ appearance, children }: Props) => (
  <fieldset className={getMainClasses(appearance, styles)}>
    {children}
  </fieldset>
);

FieldSet.displayName = displayName;

export default FieldSet;
