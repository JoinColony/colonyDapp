import React from 'react';
import { MessageDescriptor, FormattedMessage } from 'react-intl';

import { getMainClasses } from '~utils/css';
import { UniversalMessageValues } from '~types/index';

import styles from './ActionsPageTip.css';

const displayName = 'dashboard.ActionsPageFeed.ActionsPageTip';

export interface Appearance {
  theme?: 'default' | 'recovery';
}

interface Props {
  appearance?: Appearance;
  tip?: MessageDescriptor | string;
  tipValues?: UniversalMessageValues;
}

const ActionsPageTip = ({ tip, tipValues, appearance }: Props) => (
  <div className={getMainClasses(appearance, styles)}>
    <div className={styles.content}>
      {tip && tip === 'string' ? (
        tip
      ) : (
        <FormattedMessage {...tip} values={tipValues} />
      )}
    </div>
  </div>
);

ActionsPageTip.displayName = displayName;

export default ActionsPageTip;
