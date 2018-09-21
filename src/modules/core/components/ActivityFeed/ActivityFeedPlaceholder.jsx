/* @flow */
import React, { Fragment } from 'react';

import UserMention from '~core/UserMention';

import styles from './ActivityFeedPlaceholder.css';

import ActivityFeedItem from './ActivityFeedItem.jsx';

const displayName = 'ActivityFeedPlaceholder';

const ActivityFeedPlaceholder = () => (
  <Fragment>
    <ActivityFeedItem>
      <div className={styles.placeholderItem}>
        <p>
          Assigned <UserMention ensName="chris" /> to{' '}
          <b>Refactor CSS Components</b>
        </p>
        <p>
          <b>C21t in #Dev</b> | <small>2 days ago</small>
        </p>
        <div className={styles.placeholderCoverUp} />
      </div>
    </ActivityFeedItem>
    <ActivityFeedItem>
      <div className={styles.placeholderItem}>
        <p>
          Commented on <b>Build Prototype Ideas</b>
        </p>
        <p>
          <b>Zirtual in #Design</b> | <small>3 days ago</small>
        </p>
        <div className={styles.placeholderCoverUp} />
      </div>
    </ActivityFeedItem>
    <ActivityFeedItem>
      <div className={styles.placeholderItem}>
        <p>
          Added skill tag to <b>Usability Testing</b>
        </p>
        <p>
          <b>C21t in #Design</b> | <small>5 days ago</small>
        </p>
        <div className={styles.placeholderCoverUp} />
      </div>
    </ActivityFeedItem>
    <ActivityFeedItem>
      <div className={styles.placeholderItem}>
        <p>
          Commented on <b>Build Prototype Ideas</b>
        </p>
        <p>
          <b>Zirtual in #Design</b> | <small>3 weeks ago</small>
        </p>
        <div className={styles.placeholderCoverUp} />
      </div>
    </ActivityFeedItem>
    <ActivityFeedItem>
      <div className={styles.placeholderItem}>
        <p>
          Commented on <b>New Website Design</b>
        </p>
        <p>
          <b>Zirtual in #Design</b> | <small>3 weeks ago</small>
        </p>
        <div className={styles.placeholderCoverUp} />
      </div>
    </ActivityFeedItem>
    <ActivityFeedItem>
      <div className={styles.placeholderItem}>
        <p>
          Assigned <UserMention ensName="pat" /> to <b>Conduct 5x Interviews</b>
        </p>
        <p>
          <b>Colony in #Design</b> | <small>4 weeks ago</small>
        </p>
        <div className={styles.placeholderCoverUp} />
      </div>
    </ActivityFeedItem>
  </Fragment>
);

ActivityFeedPlaceholder.displayName = displayName;

export default ActivityFeedPlaceholder;
