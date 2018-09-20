/* @flow */
import React from 'react';

import UserMention from '~core/UserMention';

import styles from './ActivityFeedPlaceholder.css';

import ActivityFeedItem from './ActivityFeedItem.jsx';

const ActivityFeedPlaceholder = () => (
  <div className={styles.main}>
    <ActivityFeedItem>
      <div>
        <p>
          Assigned <UserMention ensName="chris" /> to{' '}
          <b>Refactor CSS Components</b>
        </p>
        <p>
          <b>C21t in #Dev</b> | <small>2 days ago</small>
        </p>
      </div>
    </ActivityFeedItem>
    <ActivityFeedItem>
      <div>
        <p>
          Commented on <b>Build Prototype Ideas</b>
        </p>
        <p>
          <b>Zirtual in #Design</b> | <small>3 days ago</small>
        </p>
      </div>
    </ActivityFeedItem>
    <ActivityFeedItem>
      <div>
        <p>
          Added skill tag to <b>Usability Testing</b>
        </p>
        <p>
          <b>C21t in #Design</b> | <small>5 days ago</small>
        </p>
      </div>
    </ActivityFeedItem>
    <ActivityFeedItem>
      <div>
        <p>
          Commented on <b>Build Prototype Ideas</b>
        </p>
        <p>
          <b>Zirtual in #Design</b> | <small>3 weeks ago</small>
        </p>
      </div>
    </ActivityFeedItem>
    <ActivityFeedItem>
      <div>
        <p>
          Commented on <b>New Website Design</b>
        </p>
        <p>
          <b>Zirtual in #Design</b> | <small>3 weeks ago</small>
        </p>
      </div>
    </ActivityFeedItem>
    <ActivityFeedItem>
      <div>
        <p>
          Assigned <UserMention ensName="pat" /> to <b>Conduct 5x Interviews</b>
        </p>
        <p>
          <b>Colony in #Design</b> | <small>4 weeks ago</small>
        </p>
      </div>
    </ActivityFeedItem>
    <div className={styles.coverUp} />
  </div>
);

export default ActivityFeedPlaceholder;
