/* @flow */

// $FlowFixMe
import React, { useRef, useLayoutEffect } from 'react';

import type { Address } from '~types';
import type { TaskDraftId, TaskFeedItemType } from '~immutable';

import { SpinnerLoader } from '~core/Preloaders';
import { useDataFetcher } from '~utils/hooks';

import { SpinnerLoader } from '~core/Preloaders';
import TaskFeedEvent from './TaskFeedEvent.jsx';
import TaskFeedComment from './TaskFeedComment.jsx';
import TaskFeedRating from './TaskFeedRating.jsx';
import { taskFeedItemsFetcher } from '../../fetchers';

import styles from './TaskFeed.css';

const displayName = 'dashboard.TaskFeed';

type Props = {|
  colonyAddress: Address,
  draftId: TaskDraftId,
|};

const TaskFeed = ({ colonyAddress, draftId }: Props) => {
  const bottomEl = useRef();

  const scrollToEnd = () => {
    if (bottomEl.current) {
      bottomEl.current.scrollIntoView(false);
    }
  };

  useLayoutEffect(
    () => {
      // Content is not fully loaded at first, wait a moment
      setTimeout(scrollToEnd, 1000);
    },
    [bottomEl],
  );

  const { data: feedItems } = useDataFetcher<TaskFeedItemType[]>(
    taskFeedItemsFetcher,
    [draftId],
    [colonyAddress, draftId],
  );

  const nFeedItems = feedItems ? feedItems.length : 0;
  useLayoutEffect(scrollToEnd, [nFeedItems]);

  return feedItems != null ? (
    <div className={styles.main}>
      <div className={styles.items}>
        <div>
          {feedItems.map(({ id, createdAt, comment, event, rating }) => {
            if (comment) {
              return (
                <TaskFeedComment
                  key={id}
                  comment={comment}
                  createdAt={createdAt}
                />
              );
            }

            if (event) {
              return (
                <TaskFeedEvent
                  colonyAddress={colonyAddress}
                  createdAt={createdAt}
                  event={event}
                  key={id}
                />
              );
            }

            /**
             * @todo Check that the reveal period is over for ratings (task feed).
             */
            return rating ? <TaskFeedRating key={id} rating={rating} /> : null;
          })}
          <div ref={bottomEl} />
        </div>
      </div>
    </div>
  ) : (
    <SpinnerLoader />
  );
};

TaskFeed.displayName = displayName;

export default TaskFeed;
