/* @flow */

import React, { Component } from 'react';

import type { UserRecord, TaskFeedItem } from '~types/index';

import Comment from './TaskFeedComment.jsx';

import styles from './TaskFeed.css';

const displayName = 'dashboard.TaskFeed';

type Props = {
  feedItems: Array<TaskFeedItem>,
  currentUser: UserRecord,
};

const isSameUser = (a: UserRecord, b: UserRecord) =>
  a.walletAddress.toLowerCase() === b.walletAddress.toLowerCase();

class TaskFeed extends Component<Props> {
  bottomEl: *;

  componentDidMount() {
    // TODO: content is not fully loaded at first, wait a moment
    setTimeout(() => {
      if (this.bottomEl) this.bottomEl.scrollIntoView(false);
    }, 100);
  }

  render() {
    const { feedItems, currentUser } = this.props;
    return (
      <div className={styles.main}>
        <div className={styles.items}>
          <div>
            {feedItems.map(({ id, user, body, timestamp, type }) => {
              switch (type) {
                case 'comment':
                  return (
                    <Comment
                      key={id}
                      user={user}
                      body={body}
                      timestamp={timestamp}
                      currentUser={isSameUser(user, currentUser)}
                    />
                  );

                case 'rating':
                  // TODO: display rating component
                  return null;

                default:
                  return null;
              }
            })}
            <div
              ref={el => {
                this.bottomEl = el;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

TaskFeed.displayName = displayName;

export default TaskFeed;
