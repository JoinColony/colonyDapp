/* @flow */
import type { Node } from 'react';

import React from 'react';

import { getMainClasses } from '~utils/css';

import styles from './CenteredTemplate.css';

type Appearance = {|
  theme: 'alt',
|};

type Props = {|
  appearance?: Appearance,
  children: Node,
|};

const displayName = 'pages.CenteredTemplate';

const CenteredTemplate = ({ appearance, children }: Props) => (
  <div className={getMainClasses(appearance, styles)}>
    <div className={styles.mainContainer}>
      <main className={styles.mainContent}>{children}</main>
    </div>
  </div>
);

CenteredTemplate.displayName = displayName;

export default CenteredTemplate;
