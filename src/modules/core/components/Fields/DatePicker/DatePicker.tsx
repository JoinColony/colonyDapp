import { useField } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import classnames from 'classnames';

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

interface DatePickerFieldValue {
  date: Date;
  option?: any;
}

interface DatePickerOption {
  label: string | MessageDescriptor;
  value: any;
  hideDatePicker?: boolean;
}

interface Props {
  name: string;
  showTimeSelect?: boolean;
  /** react-datepicker compatible format */
  dateFormat?: string;
  /** Defines the interval (in minutes) between time options */
  timeInterval?: number;
  /** List of options to be displayed in DatePicker dropdown */
  options?: DatePickerOption[];
}

interface DateInputProps extends React.HTMLProps<HTMLButtonElement> {
  currentOption?: DatePickerOption | null;
}

/** The component displaying the currently selected date / option */
const DateInput = (
  { onClick, value, currentOption }: DateInputProps,
  ref: React.Ref<HTMLButtonElement>,
) => {
  return (
    <button
      type="button"
      className={styles.dateButton}
      onClick={onClick}
      ref={ref}
    >
      {currentOption && currentOption.hideDatePicker
        ? currentOption.label
        : value}

      <span className={styles.expandDateIcon}>
        <Icon name="caret-down-small" title={MSG.expandIconHTMLTitle} />
      </span>
    </button>
  );
};

const displayName = 'DatePicker';

const DatePicker = ({
  name,
  showTimeSelect,
  dateFormat = 'd MMM y, h:mm aaa',
  timeInterval = 30,
  options,
}: Props) => {
  const [field, , helpers] = useField<DatePickerFieldValue>(name);

  const handleDateChange = useCallback(
    (UTCDate: Date) => {
      /** Convert the "fake UTC date" to a correct date */
      const updatedDate = new Date(UTCDate);
      updatedDate.setUTCFullYear(UTCDate.getFullYear());
      updatedDate.setUTCMonth(UTCDate.getMonth());
      updatedDate.setUTCDate(UTCDate.getDate());
      updatedDate.setUTCHours(UTCDate.getHours());
      updatedDate.setUTCMinutes(UTCDate.getMinutes());

      helpers.setValue({
        ...field.value,
        date: updatedDate,
      });
    },
    [field.value, helpers],
  );

  const handleOptionChange = useCallback(
    (option: any) => {
      helpers.setValue({
        ...field.value,
        option,
      });
    },
    [field.value, helpers],
  );

  const localDate = field.value.date ? new Date(field.value.date) : null;
  /** Convert localDate to "fake UTC date" so that it can be correctly formatted and displayed */
  const UTCDate = localDate
    ? new Date(
        localDate.getUTCFullYear(),
        localDate.getUTCMonth(),
        localDate.getUTCDate(),
        localDate.getUTCHours(),
        localDate.getUTCMinutes(),
      )
    : null;

  const currentOption = options?.find((o) => o.value === field.value.option);

  const renderHeader = useCallback(
    (props) => (
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
    ),
    [],
  );

  const renderContainer = useCallback(
    (props) => {
      return (
        <div className={styles.container}>
          {options && (
            <div
              className={classnames(styles.options, {
                [styles.withDatePicker]: !currentOption?.hideDatePicker,
              })}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={classnames(styles.option, {
                    [styles.selected]:
                      field.value.option && option.value === field.value.option,
                  })}
                  onClick={() => handleOptionChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {!currentOption?.hideDatePicker && (
            <>
              <CalendarContainer {...props} />

              {showTimeSelect && UTCDate && (
                <TimePicker
                  selectedDate={UTCDate}
                  onChange={handleDateChange}
                  timeInterval={timeInterval}
                />
              )}
            </>
          )}
        </div>
      );
    },
    [
      UTCDate,
      currentOption,
      field.value.option,
      handleDateChange,
      handleOptionChange,
      options,
      showTimeSelect,
      timeInterval,
    ],
  );

  return (
    <div>
      <ReactDatePicker
        selected={UTCDate}
        onChange={handleDateChange}
        onBlur={() => helpers.setTouched(true)}
        onCalendarClose={() => helpers.setTouched(true)}
        dateFormat={dateFormat}
        calendarStartDay={1}
        formatWeekDay={(day) => day.substring(0, 1)}
        shouldCloseOnSelect={false}
        popperPlacement="right-start"
        customInput={React.createElement(React.forwardRef(DateInput), {
          currentOption,
        })}
        renderCustomHeader={renderHeader}
        calendarContainer={renderContainer}
      />
    </div>
  );
};

DatePicker.displayName = displayName;

export default DatePicker;
