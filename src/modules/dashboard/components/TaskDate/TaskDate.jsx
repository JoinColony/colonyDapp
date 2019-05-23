/* @flow */

// $FlowFixMe upgrade flow
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedDate, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Button, { ActionButton } from '~core/Button';
import DatePicker from '~core/DatePicker';
import { ACTIONS } from '~redux';

import styles from './TaskDate.css';

import type { TaskProps } from '~immutable';
import { mergePayload } from '~utils/actions';

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
  const [selectedDate, setSelectedDate] = useState(dueDate);

  const handleSelectDate = useCallback(
    (date: ?Date) => setSelectedDate(date),
    [],
  );
  return (
    <div className={styles.main}>
      <div className={styles.controls}>
        <Heading
          appearance={{ size: 'small', margin: 'none' }}
          text={MSG.title}
        />
        {!disabled && (
          <DatePicker
            elementOnly
            connect={false}
            name="taskDueDate"
            setValue={handleSelectDate}
            $value={selectedDate}
            showArrow={false}
            renderTrigger={
              <Button
                appearance={{ theme: 'blue', size: 'small' }}
                text={MSG.selectDate}
                textValues={{
                  dateSelected: !!dueDate,
                }}
              />
            }
            renderContentFooter={(close, currentDate) => (
              <div className={styles.dateControls}>
                <Button
                  appearance={{ theme: 'secondary' }}
                  text={{ id: 'button.cancel' }}
                  onClick={() => close(null, { cancelled: true })}
                />
                <ActionButton
                  appearance={{ theme: 'primary' }}
                  text={{ id: 'button.confirm' }}
                  submit={ACTIONS.TASK_SET_DUE_DATE}
                  success={ACTIONS.TASK_SET_DUE_DATE_SUCCESS}
                  error={ACTIONS.TASK_SET_DUE_DATE_ERROR}
                  onSuccess={close}
                  transform={mergePayload({
                    colonyAddress,
                    draftId,
                    dueDate: currentDate,
                  })}
                />
              </div>
            )}
          />
        )}
      </div>
      <div className={styles.currentDate}>
        {selectedDate ? (
          <FormattedDate
            value={selectedDate}
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
