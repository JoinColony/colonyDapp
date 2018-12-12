/* @flow */

import type { List } from 'immutable';

import React, { Component } from 'react';

import type { UserRecord, TaskFeedItemRecord } from '~immutable';

import Comment from './TaskFeedComment.jsx';
import Rating from './TaskFeedRating.jsx';

import styles from './TaskFeed.css';

const displayName = 'dashboard.TaskFeed';

type Props = {
  currentUser: UserRecord,
  feedItems: List<TaskFeedItemRecord>,
  isRevealEnded: boolean,
};

const isSameUser = (a: UserRecord, b: UserRecord) =>
  a.profile.walletAddress.toLowerCase() ===
  b.profile.walletAddress.toLowerCase();

class TaskFeed extends Component<Props> {
  bottomEl: *;

  componentDidMount() {
    // TODO: content is not fully loaded at first, wait a moment
    setTimeout(() => {
      if (this.bottomEl) this.bottomEl.scrollIntoView(false);
    }, 100);
  }

  render() {
    const { currentUser, isRevealEnded, feedItems } = this.props;
    return (
      <div className={styles.main}>
        <div className={styles.items}>
          <div>
            {feedItems.map(({ id, createdAt, comment, rating }) => {
              if (comment)
                return (
                  <Comment
                    key={id}
                    comment={comment}
                    createdAt={createdAt}
                    currentUser={isSameUser(comment.user, currentUser)}
                  />
                );

              // For ratings, check that the reveal period is over
              return rating && isRevealEnded ? (
                <Rating key={id} rating={rating} />
              ) : null;
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
