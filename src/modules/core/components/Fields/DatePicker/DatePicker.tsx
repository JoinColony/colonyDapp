import { useField } from 'formik';
import React from 'react';
import { defineMessages } from 'react-intl';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import Icon from '~core/Icon';
import TimePicker from './TimePicker';

import styles from './DatePicker.css';
import { MONTH_NAMES } from './constants';

const MSG = defineMessages({
  expandIconHTMLTitle: {
    id: 'DatePicker.expandIconHTMLTitle',
    defaultMessage: 'expand',
  },
});

interface Props {
  /** Html name attribute */
  name: string;
  showTimeSelect?: boolean;
  /** react-datepicker compatible format */
  dateFormat?: string;
}

const DateInput = (
  { onClick, value }: React.HTMLProps<HTMLButtonElement>,
  ref: React.Ref<HTMLButtonElement>,
) => (
  <button
    type="button"
    className={styles.dateButton}
    onClick={onClick}
    ref={ref}
  >
    {value}

    <span className={styles.expandDateIcon}>
      <Icon name="caret-down-small" title={MSG.expandIconHTMLTitle} />
    </span>
  </button>
);

const displayName = 'DatePicker';

const DatePicker = ({
  name,
  showTimeSelect,
  dateFormat = 'd MMM y, h:mm aaa',
}: Props) => {
  const [field, , helpers] = useField(name);

  const handleChange = (date: Date | null) => {
    helpers.setValue(date);
  };

  return (
    <div>
      <ReactDatePicker
        selected={(field.value && new Date(field.value)) || null}
        onChange={handleChange}
        onBlur={() => helpers.setTouched(true)}
        onCalendarClose={() => helpers.setTouched(true)}
        dateFormat={dateFormat}
        calendarStartDay={1}
        formatWeekDay={(day) => day.substring(0, 1)}
        shouldCloseOnSelect={false}
        popperPlacement="right-start"
        customInput={React.createElement(React.forwardRef(DateInput))}
        renderCustomHeader={(props) => (
          <div className={styles.header}>
            <button
              type="button"
              className={styles.prevButton}
              onClick={props.decreaseMonth}
            >
              <Icon name="caret-left" />
            </button>
            <div className={styles.currentMonth}>
              {MONTH_NAMES[props.monthDate.getMonth()]}
            </div>
            <button
              type="button"
              className={styles.nextButton}
              onClick={props.increaseMonth}
            >
              <Icon name="caret-right" />
            </button>
          </div>
        )}
        calendarContainer={(props) => (
          <div className={styles.container}>
            <CalendarContainer {...props} />

            {showTimeSelect && (
              <TimePicker
                selectedDate={new Date(field.value)}
                onChange={(date) => helpers.setValue(date)}
              />
            )}
          </div>
        )}
      />
    </div>
  );
};

DatePicker.displayName = displayName;

export default DatePicker;
