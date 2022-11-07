import { useField } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import classnames from 'classnames';
import { format } from 'date-fns';

import 'react-datepicker/dist/react-datepicker.css';

import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';

import TimePicker from './TimePicker';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from './constants';
import useDateTriggerFocus from './hooks';

import styles from './DatePicker.css';

const MSG = defineMessages({
  expandIconHTMLTitle: {
    id: 'DatePicker.expandIconHTMLTitle',
    defaultMessage: 'expand',
  },
});

export interface DatePickerFieldValue {
  date: Date;
  option?: string;
}

export interface DatePickerOption {
  label: string | MessageDescriptor;
  value: string;
  showDatePicker?: boolean;
}

interface DatePickerError {
  date?: string | MessageDescriptor;
  option?: string | MessageDescriptor;
}

interface Props {
  name: string;
  showTimeSelect?: boolean;
  /** date-fns compatible format */
  dateFormat?: string;
  /** Defines the interval (in minutes) between time options */
  timeInterval?: number;
  /** List of options to be displayed in DatePicker dropdown */
  options?: DatePickerOption[];
  minDate?: Date | null;
  maxDate?: Date | null;
}

interface DateInputProps extends React.HTMLProps<HTMLButtonElement> {
  selectedDate: Date | null;
  dateFormat: string;
  shouldShowDatePicker: boolean;
  selectedOption?: DatePickerOption | null;
  error?: DatePickerError;
}

/** The component displaying the currently selected date / option */
const DateInput = (
  {
    onClick,
    selectedDate,
    dateFormat,
    shouldShowDatePicker,
    selectedOption,
    error,
    name,
  }: DateInputProps,
  ref: React.Ref<HTMLButtonElement>,
) => {
  const { formatMessage } = useIntl();

  const labelText =
    typeof selectedOption?.label === 'object'
      ? formatMessage(selectedOption.label)
      : selectedOption?.label;

  const formattedDate = selectedDate ? format(selectedDate, dateFormat) : '';

  /** Create a local timezone date equivalent to the selectedDate UTC value for formatting */
  const utcDate = selectedDate
    ? new Date(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate(),
        selectedDate.getUTCHours(),
        selectedDate.getUTCMinutes(),
      )
    : null;
  const utcFormattedDate = utcDate ? `${format(utcDate, dateFormat)} UTC` : '';

  return (
    <Tooltip
      content={
        shouldShowDatePicker ? (
          <div className={styles.tooltipContent}>{utcFormattedDate}</div>
        ) : null
      }
    >
      <button
        type="button"
        className={classnames(styles.dateButton, {
          [styles.error]: error,
        })}
        onClick={onClick}
        ref={ref}
        name={name}
        aria-invalid={!!error?.date}
      >
        {shouldShowDatePicker ? formattedDate : labelText}

        <span
          className={classnames(styles.expandDateIcon, {
            [styles.iconError]: error,
          })}
        >
          <Icon name="caret-down-small" title={MSG.expandIconHTMLTitle} />
        </span>
      </button>
    </Tooltip>
  );
};

const displayName = 'DatePicker';

const DatePicker = ({
  name,
  showTimeSelect,
  dateFormat,
  options,
  minDate,
  maxDate,
  timeInterval = 30,
}: Props) => {
  const [{ value }, { error }, { setValue, setTouched }] = useField<
    DatePickerFieldValue
  >(name);
  const { formatMessage, formatDate } = useIntl();

  const handleDateChange = useCallback(
    (date: Date) => {
      setTouched(true);

      setValue({
        ...value,
        date,
      });
    },
    [setTouched, setValue, value],
  );

  const handleOptionChange = useCallback(
    (option: string) => {
      setTouched(true);

      setValue({
        ...value,
        option,
      });
    },
    [setTouched, setValue, value],
  );

  const selectedDate = value?.date ? new Date(value.date) : null;

  const selectedOption = options?.find((o) => o.value === value?.option);

  const shouldShowDatePicker =
    !selectedOption || !!selectedOption.showDatePicker;

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
          {formatDate(props.monthDate, { month: 'long', year: 'numeric' })}
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
    [formatDate],
  );

  const renderContainer = useCallback(
    (props) => {
      return (
        <div className={styles.container}>
          {options && (
            <div
              className={classnames(styles.options, {
                [styles.withDatePicker]: shouldShowDatePicker,
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

          {shouldShowDatePicker && (
            <>
              <CalendarContainer {...props} />

              {showTimeSelect && selectedDate && (
                <TimePicker
                  selectedDate={selectedDate}
                  onChange={handleDateChange}
                  timeInterval={timeInterval}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              )}
            </>
          )}
        </div>
      );
    },
    [
      options,
      shouldShowDatePicker,
      showTimeSelect,
      selectedDate,
      handleDateChange,
      timeInterval,
      minDate,
      maxDate,
      formatMessage,
      value,
      handleOptionChange,
    ],
  );

  const dateFormatOrDefault =
    dateFormat ?? showTimeSelect
      ? `${DEFAULT_DATE_FORMAT}, ${DEFAULT_TIME_FORMAT}`
      : DEFAULT_DATE_FORMAT;

  const { datePickerRef } = useDateTriggerFocus(name, false);

  return (
    <div>
      <ReactDatePicker
        ref={datePickerRef}
        selected={selectedDate}
        onChange={handleDateChange}
        onBlur={() => setTouched(true)}
        onCalendarClose={() => setTouched(true)}
        dateFormat={dateFormatOrDefault}
        calendarStartDay={1}
        formatWeekDay={(day) => day.substring(0, 1)}
        minDate={minDate}
        maxDate={maxDate}
        shouldCloseOnSelect={false}
        popperPlacement="right-start"
        name={name}
        popperModifiers={[
          {
            name: 'preventOverflow',
            options: {
              altAxis: true,
              padding: 20,
            },
          },
        ]}
        customInput={React.createElement(React.forwardRef(DateInput), {
          selectedOption,
          selectedDate,
          shouldShowDatePicker,
          dateFormat: dateFormatOrDefault,
          error: error as DatePickerError | undefined,
          name,
        })}
        renderCustomHeader={renderHeader}
        calendarContainer={renderContainer}
      />
    </div>
  );
};

DatePicker.displayName = displayName;

export default DatePicker;
