import React, { ReactNode, useCallback, useState, ChangeEvent } from 'react';
import { useField } from 'formik';
import { MessageDescriptor, useIntl } from 'react-intl';

import { InputComponentAppearance } from '~core/Fields/Input';
import Popover from '~core/Popover';
import {
  PopoverChildFnProps,
  PopoverTriggerElementType,
} from '~core/Popover/types';
import { SimpleMessageValues } from '~types/index';

import DatePickerContent from './DatePickerContent';
import InputField from './InputField';

import styles from './DatePicker.css';

export type Close = (data?: any, modifiers?: { cancelled: boolean }) => void;

interface Props {
  /** Appearance object, will be passed down to `Input`, see [InputComponent](#inputcomponent) */
  appearance?: InputComponentAppearance;

  /** Whether the picker should close when a day is selected */
  closeOnDayPick?: boolean;

  /** Whether to render the label with the input (when no `renderTrigger` provided) */
  elementOnly?: boolean;

  /** Help text (for form input) */
  help?: string | MessageDescriptor;

  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;

  /** Input label text */
  label: string | MessageDescriptor;

  /** Input label values for intl interpolation */
  labelValues?: SimpleMessageValues;

  /** Html input name */
  name: string;

  /** Placeholder text */
  placeholder?: string | MessageDescriptor;

  /** Placeholder text values for intl interpolation */
  placeholderValues?: SimpleMessageValues;

  /** Render content below the date picker, inside the popover. Useful to combine with `preventClose` */
  renderContentFooter?: (close: Close, currentDate?: Date) => ReactNode;

  /** Custom trigger to render (render prop), see [Popover](#popover) for details */
  renderTrigger?: PopoverTriggerElementType;

  /** Whether or not to show the Popover's arrow */
  showArrow?: boolean;

  /** Should it set the form value on pick. Useful when using a button to confirm choice & submit in rendered footer */
  setValueOnPick?: boolean;
}

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
  placeholder: placeholderProp,
  placeholderValues,
  renderContentFooter,
  renderTrigger,
  showArrow,
  setValueOnPick,
}: Props) => {
  const [, { value }, { setValue }] = useField(name);
  // currentDate is a temporary value to represent the value when it's not set yet (active day in date picker)
  const [currentDate, setCurrentDate] = useState<Date | undefined>(value);
  const { formatDate, formatMessage } = useIntl();

  // Handle day picking via daypicker
  const handleDayPick = useCallback(
    (day) => {
      if (setValueOnPick) {
        setValue(day);
      }
      setCurrentDate(day);
    },
    [setValue, setValueOnPick],
  );

  // Handle day picking via input field
  const handleInputChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const maybeDate = new Date(Date.parse(evt.target.value));
      setValue(evt.target.value);
      if (maybeDate instanceof Date && !Number.isNaN(maybeDate.valueOf())) {
        setCurrentDate(maybeDate);
      }
    },
    [setValue],
  );

  // Handle what should happen when the popover closes based on current state
  const handlePopoverClose = useCallback(
    (day, { cancelled } = {}) => {
      // User cancelled using ESC
      if (cancelled) {
        setCurrentDate(value);
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
        setCurrentDate(undefined);
        return;
      }
      // User removed the input value and closed
      if (!currentDate) {
        if (setValue) {
          setValue(undefined);
        }
        setCurrentDate(undefined);
      }
    },
    [currentDate, setValue, value],
  );

  const selectedDay = currentDate || value;

  const renderDatePickerContent = useCallback(
    (close) => (
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

  const placeholder =
    typeof placeholderProp === 'object'
      ? formatMessage(placeholderProp, placeholderValues)
      : placeholderProp;

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
          (({
            ref,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            toggle,
            ...props
          }: PopoverChildFnProps) => (
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
              value={formatDate(value)}
              {...props}
            />
          ))}
      </Popover>
    </div>
  );
};

DatePicker.displayName = displayName;

export default DatePicker;
