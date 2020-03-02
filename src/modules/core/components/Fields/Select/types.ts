import { MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from '~types/index';

export interface Appearance {
  alignOptions?: 'left' | 'center' | 'right';
  theme?: 'default' | 'alt' | 'grey';
  width?: 'fluid' | 'strict';
}

export interface SelectOption {
  disabled?: boolean;
  label: MessageDescriptor | string;
  value: string;
  labelValues?: SimpleMessageValues;
}
