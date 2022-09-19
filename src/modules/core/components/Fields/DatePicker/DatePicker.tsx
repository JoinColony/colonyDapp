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
  /** Defines the interval (in minutes) between time options */
  timeInterval?: number;
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
  timeInterval = 30,
}: Props) => {
  const [field, , helpers] = useField(name);

  const handleChange = (UTCDate: Date) => {
    const updatedDate = new Date(UTCDate);
    updatedDate.setUTCFullYear(UTCDate.getFullYear());
    updatedDate.setUTCMonth(UTCDate.getMonth());
    updatedDate.setUTCDate(UTCDate.getDate());
    updatedDate.setUTCHours(UTCDate.getHours());
    updatedDate.setUTCMinutes(UTCDate.getMinutes());

    helpers.setValue(updatedDate);
  };

  const localDate = new Date(field.value);
  const UTCDate = new Date(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    localDate.getUTCHours(),
    localDate.getUTCMinutes(),
  );

  return (
    <div>
      <ReactDatePicker
        selected={UTCDate}
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
                selectedDate={UTCDate}
                onChange={handleChange}
                timeInterval={timeInterval}
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
