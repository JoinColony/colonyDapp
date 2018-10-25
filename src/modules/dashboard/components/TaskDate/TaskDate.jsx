/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

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
      others {Modify}
    }`,
    // defaultMessage: 'Due Date',
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

  handleSelectDate = this.handleSelectDate.bind(this);

  handleSelectDate(date: ?Date) {
    this.setState({ selectedDate: date, touched: true });
  }

  /*
   * Set the domain when clicking the confirm button
   *
   * This will most likely call an action creator at some point
   */

  handleSetDate = this.handleSetDate.bind(this);

  handleSetDate(callback: () => void) {
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
    console.log(TaskDate.displayName, selectedDate);
  }

  handleOpen = this.handleOpen.bind(this);

  handleOpen(callback: () => void) {
    const { setDate } = this.state;
    this.setState({ selectedDate: setDate }, callback);
  }

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
              renderTrigger={({ open, ref }) => (
                <Button
                  appearance={{ theme: 'blue', size: 'small' }}
                  text={MSG.selectDate}
                  textValues={{
                    dateSelected: !!(setDate && setDate.getDate()),
                  }}
                  innerRef={ref}
                  onClick={() => this.handleOpen(open)}
                />
              )}
            />
          )}
        </div>
        <div className={styles.currentDate} />
      </div>
    );
  }
}

export default TaskDate;
