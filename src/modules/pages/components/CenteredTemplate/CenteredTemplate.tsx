import React, { ReactNode } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './CenteredTemplate.css';

interface Appearance {
  theme: 'alt';
}

interface Props {
  appearance?: Appearance;
  children: ReactNode;
}

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
