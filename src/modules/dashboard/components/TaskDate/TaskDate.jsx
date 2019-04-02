/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedDate } from 'react-intl';

import promiseListener from '../../../../createPromiseListener';

import Heading from '~core/Heading';
import Button from '~core/Button';
import DatePicker from '~core/DatePicker';
import { ACTIONS } from '~redux';

import styles from './TaskDate.css';

import type { AsyncFunction } from '../../../../createPromiseListener';

import type { TaskProps } from '~immutable';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskDate.title',
    defaultMessage: 'Due Date',
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
  isTaskCreator: boolean,
  ...TaskProps<{ colonyENSName: *, draftId: *, dueDate: * }>,
|};

type State = {
  /*
   * This values determines if any date in the (newly opened) list was selected
   */
  touched: boolean,
  /*
   * Date selected in the popover list
   */
  selectedDate: ?Date | void,
};

class TaskDate extends Component<Props, State> {
  setTaskDate: AsyncFunction<Object, void>;

  static displayName = 'dashboard.TaskDate';

  constructor(props: Props) {
    super(props);

    this.setTaskDate = promiseListener.createAsyncFunction({
      start: ACTIONS.TASK_SET_DUE_DATE,
      resolve: ACTIONS.TASK_SET_DUE_DATE_SUCCESS,
      reject: ACTIONS.TASK_SET_DUE_DATE_ERROR,
    });
  }

  state = {
    touched: false,
    selectedDate: undefined,
  };

  /*
   * Handle clicking on each individual date in the list
   */
  handleSelectDate = (date: ?Date) => {
    this.setState({ selectedDate: date, touched: true });
  };

  /*
   * Set the date when clicking the confirm button
   *
   */
  handleSetDate = async (callback: () => void) => {
    const { selectedDate } = this.state;

    const { draftId, colonyENSName } = this.props;

    this.setState(
      {
        selectedDate: undefined,
        touched: false,
      },
      callback,
    );

    try {
      await this.setTaskDate.asyncFunction({
        colonyENSName,
        draftId,
        dueDate: selectedDate,
      });
    } catch (error) {
      // TODO: handle this error properly / display it in some way
      console.error(error);
    }
  };

  /*
   * When opening the datepicker, we need to set the currently selected date
   * as the current set date (if one exist)
   *
   * Otherwise the date picker might show the wrong selected day (state won't reset)
   */
  handleOpen = (callback: () => void) => {
    const { dueDate } = this.props;
    this.setState({ selectedDate: dueDate }, callback);
  };

  /*
   * Handle cleanup when closing the popover (or pressing cancel)
   *
   * If a date was selected, but not set (didn't submit the form) then we
   * need to re-set it back to the original set date from the redux store.
   *
   * Otherwise the next time it will open it will show the selected one, and not
   * the actual set one.
   */
  handleCleanup = (callback: () => void) => {
    const { dueDate } = this.props;
    this.setState({ selectedDate: dueDate, touched: false }, callback);
  };

  render() {
    const {
      state: { touched, selectedDate },
      props: { isTaskCreator, dueDate },
    } = this;
    return (
      <div className={styles.main}>
        <div className={styles.controls}>
          <Heading
            appearance={{ size: 'small', margin: 'none' }}
            text={MSG.title}
          />
          {isTaskCreator && (
            <DatePicker
              elementOnly
              preventClose
              connect={false}
              name="taskDueDate"
              setValue={this.handleSelectDate}
              selectedDate={selectedDate}
              showArrow={false}
              renderTrigger={({ open, ref }) => (
                <Button
                  appearance={{ theme: 'blue', size: 'small' }}
                  text={MSG.selectDate}
                  textValues={{
                    dateSelected: !!dueDate,
                  }}
                  innerRef={ref}
                  onClick={() => this.handleOpen(open)}
                />
              )}
            >
              {({ close }) => (
                <div className={styles.dateControls}>
                  <Button
                    appearance={{ theme: 'secondary' }}
                    text={{ id: 'button.cancel' }}
                    onClick={() => this.handleCleanup(close)}
                  />
                  <Button
                    appearance={{ theme: 'primary' }}
                    text={{ id: 'button.confirm' }}
                    disabled={!touched}
                    onClick={() => this.handleSetDate(close)}
                  />
                </div>
              )}
            </DatePicker>
          )}
        </div>
        <div className={styles.currentDate}>
          {dueDate && (
            <FormattedDate
              value={dueDate}
              month="long"
              day="numeric"
              year="numeric"
            />
          )}
        </div>
      </div>
    );
  }
}

export default TaskDate;
