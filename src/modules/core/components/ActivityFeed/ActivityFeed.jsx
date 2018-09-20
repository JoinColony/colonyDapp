/* @flow */
import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';

import styles from './ActivityFeed.css';

import ActivityFeedPlaceholder from './ActivityFeedPlaceholder.jsx';

const MSG = defineMessages({
  title: {
    id: 'ActivityFeed.title',
    defaultMessage: 'Activity (Coming Soon)',
  },
});

const displayName = 'ActivityFeed';

const ActivityFeed = () => (
  <div className={styles.main}>
    <div className={styles.sectionTitle}>
      <Heading text={MSG.title} appearance={{ size: 'medium' }} />
    </div>
    <ul className={styles.feedItemContainer}>
      <ActivityFeedPlaceholder />
    </ul>
  </div>
);

ActivityFeed.displayName = displayName;

export default ActivityFeed;
