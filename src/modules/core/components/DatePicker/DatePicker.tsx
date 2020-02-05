import React, { ReactNode, useCallback, useState } from 'react';
import createDate from 'sugar-date/date/create';
import formatDate from 'sugar-date/date/format';

import { asField } from '~core/Fields';
import { InputComponentAppearance } from '~core/Fields/Input';
import { AsFieldEnhancedProps } from '~core/Fields/types';
import Popover from '~core/Popover';
import {
  PopoverChildFnProps,
  PopoverTriggerElementType,
} from '~core/Popover/types';

import DatePickerContent from './DatePickerContent';
import InputField from './InputField';

import styles from './DatePicker.css';

export type Close = (data?: any, modifiers?: { cancelled: boolean }) => void;

interface Props {
  /** Appearance object, will be passed down to `Input`, see [InputComponent](#inputcomponent) */
  appearance?: InputComponentAppearance;

  /** Whether the picker should close when a day is selected */
  closeOnDayPick?: boolean;

  /** Render content below the date picker, inside the popover. Useful to combine with `preventClose` */
  renderContentFooter?: (close: Close, currentDate?: Date) => ReactNode;

  /** Custom trigger to render (render prop), see [Popover](#popover) for details */
  renderTrigger?: PopoverTriggerElementType;

  /** Whether or not to show the Popover's arrow */
  showArrow?: boolean;

  /** Should it set the form value on pick. Useful when using a button to confirm choice & submit in rendered footer */
  setValueOnPick?: boolean;
}

const getShortDate = (date: Date) => formatDate(date, '{date} {Mon} {year}');

const displayName = 'DatePicker';

const DatePicker = ({
  appearance,
  closeOnDayPick,
  elementOnly,
  help,
  label,
  name,
  placeholder,
  renderContentFooter,
  renderTrigger,
  showArrow,
  setValueOnPick,
  $value,
  setValue,
}: Props & AsFieldEnhancedProps) => {
  // Handles state of the input field if present
  const [inputValue, setInputValue] = useState('');
  // currentDate is a temporary value to represent the value when it's not set yet (active day in date picker)
  const [currentDate, setCurrentDate] = useState($value);

  // Handle day picking via daypicker
  const handleDayPick = useCallback(
    day => {
      if (setValueOnPick && setValue) {
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
        setCurrentDate($value);
        return;
      }

      /* User:
      a) has selected a date and then clicked outside of the popover (=close)
      b) typed in a day and tabbed out
      c) clicked on a date with `closeOnDayPick` on
    */
      const date = day || currentDate;
      if (date) {
        if (setValue) {
          setValue(date);
        }
        setInputValue(getShortDate(date));
        setCurrentDate(undefined);
        return;
      }
      // User removed the input value and closed
      if (!inputValue) {
        if (setValue) {
          setValue(undefined);
        }
        setInputValue('');
        setCurrentDate(undefined);
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
        onClose={handlePopoverClose}
        placement="bottom"
        retainRefFocus
        showArrow={showArrow}
        content={({ close }) => renderDatePickerContent(close)}
      >
        {renderTrigger ||
          (({ ref, ...props }: PopoverChildFnProps) => (
            <InputField
              appearance={appearance}
              elementOnly={elementOnly}
              name={name}
              help={help}
              label={label}
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

export default asField<Props>()(DatePicker);
