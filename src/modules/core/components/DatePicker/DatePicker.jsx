/* @flow */

import type { MessageDescriptor, MessageValues } from 'react-intl';
import type { Node } from 'react';

// $FlowFixMe update flow
import React, { useCallback, useState } from 'react';
import createDate from 'sugar-date/date/create';
import formatDate from 'sugar-date/date/format';

import type { InputComponentAppearance } from '~core/Fields/Input';
import type { PopoverTriggerType } from '~core/Popover';

import { asField } from '~core/Fields';
import Popover from '~core/Popover';

import styles from './DatePicker.css';

import DatePickerContent from './DatePickerContent.jsx';
import InputField from './InputField.jsx';

export type Close = (data?: any, modifiers?: { cancelled: boolean }) => void;

type Props = {|
  /** Appearance object, will be passed down to `Input`, see [InputComponent](#inputcomponent) */
  appearance?: InputComponentAppearance,
  /** Whether the picker should close when a day is selected */
  closeOnDayPick?: boolean,
  /* eslint-disable react/no-unused-prop-types */
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean,
  /* eslint-enable react/no-unused-prop-types */
  /** Just render the `<input>` element without label */
  elementOnly?: boolean,
  /** Input field name (form variable) */
  name: string,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: MessageValues,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: MessageValues,
  /** Placeholder for input */
  placeholder?: string,
  /** Render content below the date picker, inside the popover. Useful to combine with `preventClose` */
  renderContentFooter?: (close: Close, currentDate: ?Date) => Node,
  /** Custom trigger to render (render prop), see [Popover](#popover) for details */
  renderTrigger?: PopoverTriggerType,
  /** Whether or not to show the Popover's arrow */
  showArrow?: boolean,
  /** @ignore Will be injected by `asField` */
  $value?: ?Date,
  /** @ignore Will be injected by `asField` */
  setValue: (val: ?Date) => void,
  /** Should it set the form value on pick. Useful when using a button to confirm choice & submit in rendered footer */
  setValueOnPick?: boolean,
|};

const getShortDate = (date: Date) => formatDate(date, '{date} {Mon} {year}');

const displayName = 'DatePicker';

const DatePicker = ({
  appearance,
  closeOnDayPick,
  elementOnly,
  help,
  helpValues,
  label,
  labelValues,
  name,
  placeholder,
  renderContentFooter,
  renderTrigger,
  showArrow,
  setValue,
  setValueOnPick,
  $value,
}: Props) => {
  // Handles state of the input field if present
  const [inputValue, setInputValue] = useState('');
  // currentDate is a temporary value to represent the value when it's not set yet (active day in date picker)
  const [currentDate, setCurrentDate] = useState($value);

  // Handle day picking via daypicker
  const handleDayPick = useCallback(
    day => {
      if (setValueOnPick) {
        setValue(day);
      }
      setCurrentDate(day);
      setInputValue(getShortDate(day));
    },
    [setValue, setValueOnPick],
  );

  // Handle day picking via input field
  const handleInputChange = useCallback(evt => {
    const maybeDate = createDate(evt.target.value);
    setInputValue(evt.target.value);
    if (maybeDate instanceof Date && !Number.isNaN(maybeDate.valueOf())) {
      setCurrentDate(maybeDate);
    }
  }, []);

  // Handle what should happen when the popover closes based on current state
  const handlePopoverClose = useCallback(
    (day, { cancelled } = {}) => {
      // User cancelled using ESC
      if (cancelled) {
        setInputValue($value ? getShortDate($value) : '');
        setCurrentDate($value || null);
        return;
      }
      /* User:
        a) has selected a date and then clicked outside of the popover (=close)
        b) typed in a day and tabbed out
        c) clicked on a date with `closeOnDayPick` on
      */
      const date = day || currentDate;
      if (date) {
        setValue(date);
        setInputValue(getShortDate(date));
        setCurrentDate(null);
        return;
      }
      // User removed the input value and closed
      if (!inputValue) {
        setValue(null);
        setInputValue('');
        setCurrentDate(null);
      }
    },
    [$value, currentDate, inputValue, setValue],
  );

  const selectedDay = currentDate || $value;

  const renderDatePickerContent = useCallback(
    close => (
      <DatePickerContent
        close={close}
        closeOnDayPick={closeOnDayPick}
        currentDate={currentDate}
        onDayPick={handleDayPick}
        selectedDay={selectedDay}
        renderContentFooter={renderContentFooter}
      />
    ),
    [
      closeOnDayPick,
      currentDate,
      handleDayPick,
      renderContentFooter,
      selectedDay,
    ],
  );

  return (
    <div className={styles.main}>
      <Popover
        className={styles.picker}
        onClose={handlePopoverClose}
        placement="bottom"
        retainRefFocus
        showArrow={showArrow}
        content={({ close }) => renderDatePickerContent(close)}
      >
        {renderTrigger ||
          (({ ref, ...props }) => (
            <InputField
              appearance={appearance}
              elementOnly={elementOnly}
              name={name}
              help={help}
              helpValues={helpValues}
              label={label}
              labelValues={labelValues}
              innerRef={ref}
              onChange={handleInputChange}
              placeholder={placeholder}
              value={inputValue}
              {...props}
            />
          ))}
      </Popover>
    </div>
  );
};

DatePicker.displayName = displayName;

export default asField()(DatePicker);
