import React, { useCallback } from 'react';
import { defineMessages, FormattedDate, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';
import DatePicker from '~core/DatePicker';
import { ActionForm } from '~core/Fields/Form';
import { ActionTypes } from '~redux/index';
import { TaskProps } from '~immutable/index';
import { mapPayload, mergePayload, pipe } from '~utils/actions';
import styles from './TaskDate.css';

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

interface Props
  extends TaskProps<'colonyAddress' | 'draftId' | 'dueDate' | 'domainId'> {
  disabled?: boolean;
}

const displayName = 'dashboard.TaskDate';

const TaskDate = ({
  colonyAddress,
  draftId,
  dueDate,
  disabled,
  domainId,
}: Props) => {
  const transform = useCallback(
    pipe(
      mapPayload(({ taskDueDate }) => ({ dueDate: taskDueDate })),
      mergePayload({
        colonyAddress,
        draftId,
        domainId,
      }),
    ),
    [colonyAddress, draftId, domainId],
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
            submit={ActionTypes.TASK_SET_DUE_DATE}
            success={ActionTypes.TASK_SET_DUE_DATE_SUCCESS}
            error={ActionTypes.TASK_SET_DUE_DATE_ERROR}
            transform={transform}
          >
            {({ submitForm, setFormikState }) => (
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
                      appearance={{ theme: 'danger' }}
                      disabled={!dueDate}
                      text={{ id: 'button.remove' }}
                      onClick={() => {
                        setFormikState(state => ({
                          ...state,
                          values: {},
                        }));
                        const result: any = submitForm();
                        result.then(() => {
                          close();
                        });
                      }}
                    />
                    <Button
                      appearance={{ theme: 'primary' }}
                      text={{ id: 'button.confirm' }}
                      onClick={() => {
                        const result: any = submitForm();
                        result.then(() => {
                          close();
                        });
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
