import React from 'react';
import { RouteChildrenProps, useParams } from 'react-router';
import CreatorData from '~dashboard/ExpenditurePage/CreatorData';

import { getMainClasses } from '~utils/css';

import styles from './ExpenditureTemplate.css';

type Props = RouteChildrenProps<{ colonyName: string }>;

const displayName = 'pages.ExpenditureTemplate';

const ExpenditureTemplate = ({ match }: Props) => {
  if (!match) {
    throw new Error(
      `No match found for route in ${displayName} Please check route setup.`,
    );
  }

  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  return (
    <div className={getMainClasses({}, styles)}>
      <aside className={styles.sidebar}>
        <CreatorData {...{ colonyName }} />
      </aside>
      <div className={styles.mainContainer}>
        <main className={styles.mainContent} />
      </div>
    </div>
  );
};

ExpenditureTemplate.displayName = displayName;

export default ExpenditureTemplate;
