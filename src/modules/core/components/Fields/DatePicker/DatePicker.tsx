import { useField } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import classnames from 'classnames';

import 'react-datepicker/dist/react-datepicker.css';

import Icon from '~core/Icon';

import TimePicker from './TimePicker';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  MONTH_NAMES,
} from './constants';
import styles from './DatePicker.css';

const MSG = defineMessages({
  expandIconHTMLTitle: {
    id: 'DatePicker.expandIconHTMLTitle',
    defaultMessage: 'expand',
  },
});

interface DatePickerFieldValue {
  date: Date;
  option?: string;
}

export interface DatePickerOption {
  label: string | MessageDescriptor;
  value: string;
  hideDatePicker: boolean;
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
  const { formatMessage } = useIntl();

  const labelText =
    typeof currentOption?.label === 'object'
      ? formatMessage(currentOption.label)
      : currentOption?.label;

  return (
    <button
      type="button"
      className={styles.dateButton}
      onClick={onClick}
      ref={ref}
    >
      {currentOption?.hideDatePicker ? labelText : `${value} UTC`}

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
  timeInterval = 30,
  dateFormat,
  options,
}: Props) => {
  const [{ value }, , { setValue, setTouched }] = useField<
    DatePickerFieldValue
  >(name);
  const { formatMessage } = useIntl();

  const handleDateChange = useCallback(
    (UTCDate: Date) => {
      /** Convert the "fake UTC date" to a correct date */
      const updatedDate = new Date(UTCDate);
      updatedDate.setUTCFullYear(UTCDate.getFullYear());
      updatedDate.setUTCMonth(UTCDate.getMonth());
      updatedDate.setUTCDate(UTCDate.getDate());
      updatedDate.setUTCHours(UTCDate.getHours());
      updatedDate.setUTCMinutes(UTCDate.getMinutes());

      setValue({
        ...value,
        date: updatedDate,
      });
    },
    [setValue, value],
  );

  const handleOptionChange = useCallback(
    (option: any) => {
      setValue({
        ...value,
        option,
      });
    },
    [setValue, value],
  );

  const localDate = value?.date ? new Date(value.date) : null;
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

  const currentOption = options?.find((o) => o.value === value?.option);

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
              {options.map((option) => {
                const labelText =
                  typeof option.label === 'object'
                    ? formatMessage(option.label)
                    : option.label;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={classnames(styles.option, {
                      [styles.selected]:
                        value?.option && option.value === value.option,
                    })}
                    onClick={() => handleOptionChange(option.value)}
                  >
                    {labelText}
                  </button>
                );
              })}
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
      formatMessage,
      handleDateChange,
      handleOptionChange,
      options,
      showTimeSelect,
      timeInterval,
      value,
    ],
  );

  const dateFormatOrDefault =
    dateFormat ?? showTimeSelect
      ? `${DEFAULT_DATE_FORMAT}, ${DEFAULT_TIME_FORMAT}`
      : DEFAULT_DATE_FORMAT;

  return (
    <div>
      <ReactDatePicker
        selected={UTCDate}
        onChange={handleDateChange}
        onBlur={() => setTouched(true)}
        onCalendarClose={() => setTouched(true)}
        dateFormat={dateFormatOrDefault}
        calendarStartDay={1}
        formatWeekDay={(day) => day.substring(0, 1)}
        shouldCloseOnSelect={false}
        popperPlacement="right-start"
        popperModifiers={[
          {
            name: 'preventOverflow',
            options: {
              altAxis: true,
              padding: 8,
            },
          },
        ]}
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
