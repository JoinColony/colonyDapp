/* @flow */

import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React from 'react';
import { TabList as ReactTabList } from 'react-tabs';

import Heading from '~core/Heading';

import { getMainClasses } from '~utils/css';

import styles from './TabList.css';

type Appearance = {
  theme?: 'vertical',
};

type Props = {
  /** Node to render into the right of the TabList */
  extra?: Node,
  appearance: Appearance,
  headline?: MessageDescriptor | string,
};

const displayName = 'TabList';

const TabList = ({ extra, appearance, headline, ...props }: Props) => (
  <div>
    {headline && (
      <Heading appearance={{ theme: 'dark', size: 'normal' }} text={headline} />
    )}
    <div className={`styles.container ${getMainClasses(appearance, styles)}`}>
      <ReactTabList className={styles.main} {...props} />
      {extra && <span className={styles.extra}>{extra}</span>}
    </div>
  </div>
);

TabList.tabsRole = 'TabList';

TabList.displayName = displayName;

export default TabList;
