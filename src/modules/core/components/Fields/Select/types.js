/* @flow */

import type { MessageDescriptor } from 'react-intl';

export type Appearance = {
  alignOptions?: 'left' | 'center' | 'right',
  theme?: 'default' | 'alt',
};

export type SelectOptionType = {
  label: MessageDescriptor | string,
  value: string,
};
