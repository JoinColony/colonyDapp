import React, { Fragment, useRef, useLayoutEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { EventTypes } from '~data/constants';

import { Address } from '~types/index';
import { TaskCommentType } from '~immutable/index';
import { SpinnerLoader } from '~core/Preloaders';
import { useDataSubscriber } from '~utils/hooks';
import TaskFeedCompleteInfo from './TaskFeedCompleteInfo';
import TaskFeedEvent from './TaskFeedEvent';
import TaskFeedComment from './TaskFeedComment';
import TaskFeedRating from './TaskFeedRating';
import { taskFeedItemsSubscriber } from '../../subscribers';
import styles from './TaskFeed.css';

const displayName = 'dashboard.TaskFeed';

interface Props {
  colonyAddress: Address;
  draftId: string;
}

const MSG = defineMessages({
  feedLoadingText: {
    id: 'dashboard.TaskFeed.feedLoadingText',
    defaultMessage: 'Loading Task Events...',
  },
});

const TaskFeed = ({ colonyAddress, draftId }: Props) => {
  const bottomEl = useRef(null);

  const scrollToEnd = () => {
    if (bottomEl.current) {
      (bottomEl.current as any).scrollIntoView(false);
    }
  };

  useLayoutEffect(() => {
    // Content is not fully loaded at first, wait a moment
    setTimeout(scrollToEnd, 1000);
  }, [bottomEl]);

  const {
    data: feedItems,
    isFetching: isFetchingFeedItems,
  } = useDataSubscriber(
    taskFeedItemsSubscriber,
    [draftId],
    [colonyAddress, draftId],
  );

  const nFeedItems = feedItems ? feedItems.length : 0;
  useLayoutEffect(scrollToEnd, [nFeedItems]);

  return isFetchingFeedItems ? (
    <SpinnerLoader />
  ) : (
    <>
      {feedItems && (
        <div className={styles.main}>
          <div className={styles.items}>
            {/*
             * There is always at least one task event: TASK_CREATED
             */
            feedItems.length < 1 ? (
              <div className={styles.eventsLoader}>
                <SpinnerLoader appearance={{ size: 'small' }} />
                <span className={styles.eventsLoaderText}>
                  <FormattedMessage {...MSG.feedLoadingText} />
                </span>
              </div>
            ) : (
              <div>
                {feedItems.map(({ id, createdAt, comment, event, rating }) => {
                  if (comment) {
                    return (
                      <TaskFeedComment
                        key={id}
                        comment={comment as TaskCommentType}
                        createdAt={createdAt as Date}
                      />
                    );
                  }

                  // @todo if task is finalized
                  if (event && event.type === EventTypes.TASK_FINALIZED) {
                    return (
                      <Fragment key={id}>
                        <TaskFeedCompleteInfo
                          event={event}
                          createdAt={createdAt as Date}
                        />
                        <TaskFeedEvent
                          colonyAddress={colonyAddress}
                          createdAt={createdAt as Date}
                          event={event}
                        />
                      </Fragment>
                    );
                  }

                  if (event) {
                    return (
                      <TaskFeedEvent
                        colonyAddress={colonyAddress}
                        createdAt={createdAt as Date}
                        event={event}
                        key={id}
                      />
                    );
                  }

                  /**
                   * @todo Check that the reveal period is over for ratings
                   * (task feed).
                   */
                  if (rating) {
                    return <TaskFeedRating key={id} rating={rating} />;
                  }

                  return null;
                })}
                <div ref={bottomEl} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

TaskFeed.displayName = displayName;

export default TaskFeed;
