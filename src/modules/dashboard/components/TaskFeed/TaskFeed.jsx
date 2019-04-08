/* @flow */

import React, { Component } from 'react';

import type { UserType } from '~immutable';

import { addressEquals } from '~utils/strings';

import Comment from './TaskFeedComment.jsx';
import Rating from './TaskFeedRating.jsx';

import styles from './TaskFeed.css';

import mockUser from '../Wallet/__datamocks__/mockUser';

const displayName = 'dashboard.TaskFeed';

type Props = {|
  // TODO in #580 require a `draftId` prop
  currentUser: UserType,
|};

const isSameUser = (a: UserType, b: UserType) =>
  addressEquals(a.profile.walletAddress, b.profile.walletAddress);

// TODO in #580 convert to a functional component
class TaskFeed extends Component<Props> {
  bottomEl: *;

  componentDidMount() {
    // TODO: content is not fully loaded at first, wait a moment
    setTimeout(() => {
      if (this.bottomEl) this.bottomEl.scrollIntoView(false);
    }, 100);
  }

  render() {
    // TODO in #580 use a selector for this
    const { currentUser } = this.props;

    // TODO in #580 use a data fetcher for these
    const feedItems = [];

    // TODO in #580 use a selector for this
    const isRevealEnded = false;

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
                    /*
                     * TODO The author wallet <-> profile raltionship will have to come from a reducer
                     */
                    currentUser={isSameUser(mockUser, currentUser)}
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
