/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedDate } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';
import DatePicker from '~core/DatePicker';

import styles from './TaskDate.css';

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

type Props = {
  isTaskCreator?: boolean,
};

type State = {
  /*
   * This values determines if any domain in the (newly opened) list was selected
   */
  touched: boolean,
  /*
   * Domain selected in the popover list
   */
  selectedDate: ?Date | void,
  /*
   * Domain that is actually set on the task
   */
  setDate: ?Date | void,
};

class TaskDate extends Component<Props, State> {
  static displayName = 'dashboard.TaskDate';

  state = {
    touched: false,
    selectedDate: undefined,
    setDate: undefined,
  };

  /*
   * Handle clicking on each individual domain in the list
   */
  handleSelectDate = (date: ?Date) => {
    this.setState({ selectedDate: date, touched: true });
  };

  /*
   * Set the domain when clicking the confirm button
   *
   * This will most likely call an action creator at some point
   */
  handleSetDate = (callback: () => void) => {
    const { selectedDate } = this.state;
    this.setState(
      {
        setDate: selectedDate,
        selectedDate: undefined,
        touched: false,
      },
      callback,
    );
    /*
     * @NOTE Here we should be caling the action creator
     * Maybe even before changing the state
     */
    /* eslint-disable-next-line no-console */
    console.log(TaskDate.displayName, selectedDate);
  };

  /*
   * When opening the datepicker, we need to set the currently selected date
   * as the current set date (if one exist)
   *
   * Otherwise the date picker might show the wrong selected day (state won't reset)
   */
  handleOpen = (callback: () => void) => {
    const { setDate } = this.state;
    this.setState({ selectedDate: setDate }, callback);
  };

  /*
   * Handle cleanup when closing the popover (or pressing cancel)
   *
   * If a domain was selected, but not set (didn't submit the form) then we
   * need to re-set it back to the original set domain.
   *
   * Otherwise the next time it will open it will show the selected one, and not
   * the actual set one.
   */
  handleCleanup = (callback: () => void) => {
    const { setDate = undefined } = this.state;
    this.setState({ selectedDate: setDate, touched: false }, callback);
  };

  render() {
    const {
      state: { setDate, touched, selectedDate },
      props: { isTaskCreator = false },
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
                    dateSelected: !!setDate,
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
          {setDate && (
            <FormattedDate
              value={setDate}
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
