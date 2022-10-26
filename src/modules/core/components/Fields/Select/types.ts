import { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from '~types/index';

export { Props } from './Select';

export type DropdownSize = 'normal' | 'medium' | 'mediumLarge' | 'large';

export interface Appearance {
  alignOptions?: 'left' | 'center' | 'right';
  borderedOptions?: 'true' | 'false';
  size?: DropdownSize;
  theme?: 'default' | 'alt' | 'grey' | 'grid';
  width?: 'content' | 'fluid' | 'strict';
  unrestrictedOptionsWidth?: 'true' | 'false';
}

export interface SelectOption {
  // Will override `label` for display - `label` still required for a11y
  children?: ReactNode;
  disabled?: boolean;
  label: MessageDescriptor | string;
  value: string;
  labelValues?: SimpleMessageValues;
  labelElement?: ReactNode;
}
