import React, { useCallback } from 'react';
import { defineMessages, FormattedDate, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';
import DatePicker from '~core/DatePicker';
import Form from '~core/Fields/Form';
import { useSetTaskDueDateMutation } from '~data/index';

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

interface FormValues {
  taskDueDate: number;
};

interface Props {
  disabled?: boolean;
  draftId: string;
  dueDate?: number;
};

const displayName = 'dashboard.TaskDate';

const TaskDate = ({ draftId, dueDate: existingDueDate, disabled }: Props) => {
  const [setDueDate] = useSetTaskDueDateMutation();

  const onSubmit = useCallback(
    ({ taskDueDate }: FormValues) =>
      setDueDate({
        variables: {
          input: {
            id: draftId,
            dueDate: taskDueDate,
          },
        },
      }),
    [draftId, setDueDate],
  );

  return (
    <div className={styles.main}>
      <div className={styles.controls}>
        <Heading
          appearance={{ size: 'small', margin: 'none' }}
          text={MSG.title}
        />
        {!disabled && (
          <Form
            initialValues={{
              taskDueDate: existingDueDate,
            }}
            onSubmit={onSubmit}
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
                      dateSelected: !!existingDueDate,
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
                      disabled={!existingDueDate}
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
          </Form>
        )}
      </div>
      <div className={styles.currentDate}>
        {existingDueDate ? (
          <FormattedDate
            value={existingDueDate}
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
