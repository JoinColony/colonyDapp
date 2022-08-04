import React from 'react';
import { MessageDescriptor, FormattedMessage } from 'react-intl';

import { getMainClasses } from '~utils/css';
import { UniversalMessageValues } from '~types/index';

import styles from './ActionsPageSystemInfo.css';

const displayName = 'dashboard.ActionsPageFeed.ActionsPageSystemInfo';

export interface Appearance {
  theme?: 'default' | 'recovery';
}

interface Props {
  appearance?: Appearance;
  tip: MessageDescriptor | string;
  tipValues?: UniversalMessageValues;
}

const ActionsPageSystemInfo = ({ tip, tipValues, appearance }: Props) => (
  <div className={getMainClasses(appearance, styles)}>
    {typeof tip === 'object' ? (
      <FormattedMessage {...tip} values={tipValues} />
    ) : (
      tip
    )}
  </div>
);

ActionsPageSystemInfo.displayName = displayName;

export default ActionsPageSystemInfo;
