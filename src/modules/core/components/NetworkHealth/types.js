/* @flow */

import type { MessageDescriptor, MessageValues } from 'react-intl';

export type NetworkHealth = 'good' | 'mean' | 'critical';

export type NetworkHealthIconSize =
  | 'pea'
  | 'tiny'
  | 'small'
  | 'normal'
  | 'medium'
  | 'large'
  | 'huge';

export type NetworkHealthItem = {|
  itemHealth: NetworkHealth,
  /** A string or a `MessageDescriptor` that make up the headings's text */
  itemTitle: MessageDescriptor | string,
  /** Values for text (react-intl interpolation) */
  itemTitleValues?: MessageValues,
|};
export type NetworkHealthItems = Array<NetworkHealthItem>;
