/* @flow */

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';
import { defineMessages, FormattedDate, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';
import DatePicker from '~core/DatePicker';
import { ActionForm } from '~core/Fields/Form';
import { ACTIONS } from '~redux';

import styles from './TaskDate.css';

import type { TaskProps } from '~immutable';
import { mapPayload, mergePayload, pipe } from '~utils/actions';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskDate.title',
    defaultMessage: 'Due date',
  },
  notSet: {
    id: 'dashboard.TaskDate.notSet',
    defaultMessage: 'Date not set',
  },
  selectDate: {
    id: 'dashboard.TaskDate.selectDate',
    defaultMessage: `{dateSelected, select,
      false {Add +}
      other {Modify}
    }`,
  },
});

type Props = {|
  disabled?: boolean,
  ...TaskProps<{ colonyAddress: *, draftId: *, dueDate: * }>,
|};

const displayName = 'dashboard.TaskDate';

const TaskDate = ({ colonyAddress, draftId, dueDate, disabled }: Props) => {
  const transform = useCallback(
    pipe(
      mapPayload(({ taskDueDate }) => ({ dueDate: taskDueDate })),
      mergePayload({
        colonyAddress,
        draftId,
      }),
    ),
    [colonyAddress, draftId],
  );

  return (
    <div className={styles.main}>
      <div className={styles.controls}>
        <Heading
          appearance={{ size: 'small', margin: 'none' }}
          text={MSG.title}
        />
        {!disabled && (
          <ActionForm
            initialValues={{
              taskDueDate: dueDate,
            }}
            submit={ACTIONS.TASK_SET_DUE_DATE}
            success={ACTIONS.TASK_SET_DUE_DATE_SUCCESS}
            error={ACTIONS.TASK_SET_DUE_DATE_ERROR}
            transform={transform}
          >
            {({ submitForm }) => (
              <DatePicker
                elementOnly
                name="taskDueDate"
                showArrow={false}
                setValueOnPick
                renderTrigger={
                  <Button
                    appearance={{ theme: 'blue', size: 'small' }}
                    text={MSG.selectDate}
                    textValues={{
                      dateSelected: !!dueDate,
                    }}
                  />
                }
                renderContentFooter={close => (
                  <div className={styles.dateControls}>
                    <Button
                      appearance={{ theme: 'secondary' }}
                      text={{ id: 'button.cancel' }}
                      onClick={() => close(null, { cancelled: true })}
                    />
                    <Button
                      appearance={{ theme: 'primary' }}
                      text={{ id: 'button.confirm' }}
                      onClick={() => {
                        const result = submitForm();
                        // use of condition to make flow happy
                        if (result) {
                          result.then(() => {
                            close();
                          });
                        }
                      }}
                    />
                  </div>
                )}
              />
            )}
          </ActionForm>
        )}
      </div>
      <div className={styles.currentDate}>
        {dueDate ? (
          <FormattedDate
            value={dueDate}
            month="long"
            day="numeric"
            year="numeric"
          />
        ) : (
          <span className={styles.notSet}>
            <FormattedMessage {...MSG.notSet} />
          </span>
        )}
      </div>
    </div>
  );
};

TaskDate.displayName = displayName;

export default TaskDate;
