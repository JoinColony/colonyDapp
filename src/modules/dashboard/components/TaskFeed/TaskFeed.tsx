import React, { Fragment, useRef, useLayoutEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';
import { EventTypes } from '~data/constants';
import { useTaskFeedEventsQuery, TaskMessageEvent } from '~data/index';
import { Address } from '~types/index';

import TaskFeedCompleteInfo from './TaskFeedCompleteInfo';
import TaskFeedEvent from './TaskFeedEvent';
import TaskFeedComment from './TaskFeedComment';
import TaskFeedRating from './TaskFeedRating';
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

  const { data } = useTaskFeedEventsQuery({ variables: { id: draftId }})

  useLayoutEffect(scrollToEnd, [data]);

  useLayoutEffect(scrollToEnd, [feedItems.length]);

  if (!data) {
    return <SpinnerLoader />;
  }

  const { task: { events } } = data;

  return (
    <>
      {events && (
        <div className={styles.main}>
          <div className={styles.items}>
            {/*
             * There is always at least one task event: TASK_CREATED
             */
            events.length < 1 ? (
              <div className={styles.eventsLoader}>
                <SpinnerLoader appearance={{ size: 'small' }} />
                <span className={styles.eventsLoaderText}>
                  <FormattedMessage {...MSG.feedLoadingText} />
                </span>
              </div>
            ) : (
              <div>
                {events.map(({ context, createdAt, initiatorAddress, sourceId }) => {
                  if (context['type'] === EventTypes.TASK_MESSAGE) {
                    const { message } = context as TaskMessageEvent;
                    return (
                      <TaskFeedComment
                        createdAt={createdAt}
                        initiatorAddress={initiatorAddress}
                        key={sourceId}
                        message={message}
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
