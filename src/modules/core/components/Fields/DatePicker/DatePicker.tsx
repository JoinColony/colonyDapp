import { useField } from 'formik';
import React from 'react';
import { defineMessages } from 'react-intl';
import ReactDatePicker, {
  CalendarContainer,
  ReactDatePickerProps,
} from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import styles from './DatePicker.css';
import Icon from '~core/Icon';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MSG = defineMessages({
  expandIconHTMLTitle: {
    id: 'DatePicker.expandIconHTMLTitle',
    defaultMessage: 'expand',
  },
});

interface Props
  extends Pick<ReactDatePickerProps, 'showTimeSelect' | 'dateFormat'> {
  /** Html name attribute */
  name: string;
}

const SeletedDate = (
  { onClick, value }: React.HTMLProps<HTMLButtonElement>,
  ref: React.Ref<HTMLButtonElement>,
) => (
  <button
    type="button"
    className={styles.selectedDate}
    onClick={onClick}
    ref={ref}
  >
    {value}

    <span className={styles.icon}>
      <Icon name="caret-down-small" title={MSG.expandIconHTMLTitle} />
    </span>
  </button>
);

const displayName = 'DatePicker';

const DatePicker = ({ name, dateFormat, ...rest }: Props) => {
  const [field, , helpers] = useField(name);

  const handleChange = (date: Date | null) => {
    helpers.setValue(date);
  };

  return (
    <div>
      <ReactDatePicker
        {...field}
        {...rest}
        selected={(field.value && new Date(field.value)) || null}
        onChange={handleChange}
        onBlur={() => helpers.setTouched(true)}
        onCalendarClose={() => helpers.setTouched(true)}
        customInput={React.createElement(React.forwardRef(SeletedDate))}
        dateFormat={dateFormat || 'd MMM y, h:mmaaa'}
        calendarContainer={(props) => (
          <div className={styles.container}>
            <CalendarContainer {...props} />
          </div>
        )}
        calendarStartDay={1}
        formatWeekDay={(day) => day.substring(0, 1)}
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
      />
    </div>
  );
};

DatePicker.displayName = displayName;

export default DatePicker;
