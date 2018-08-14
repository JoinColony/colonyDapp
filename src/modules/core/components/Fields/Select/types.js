/* @flow */

import type { MessageDescriptor } from 'react-intl';

export type Appearance = {
  align?: 'left' | 'center' | 'right',
};

export type SelectOptionType = {
  label: MessageDescriptor | string,
  value: string,
};
