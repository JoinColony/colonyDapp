import React, { ReactNode, useCallback } from 'react';
// @ts-ignore
import DayPicker, { DateUtils } from 'react-day-picker';

import { Close } from './DatePicker';
import CaptionElement from './CaptionElement';
import NavbarElement from './NavbarElement';

import styles from './DatePickerContent.css';

interface Props {
  close: Close;
  closeOnDayPick?: boolean;
  currentDate: Date | null;
  onDayPick: (day: Date) => void;
  selectedDay: Date | null;
  renderContentFooter?: (close: Close, currentDate: Date | null) => ReactNode;
}

const displayName = 'DatePicker.DatePickerContent';

const DatePickerContent = ({
  close,
  closeOnDayPick,
  currentDate,
  onDayPick,
  renderContentFooter,
  selectedDay,
}: Props) => {
  const handleDayPick = useCallback(
    day => {
      onDayPick(day);
      if (closeOnDayPick) {
        close(day);
      }
    },
    [close, closeOnDayPick, onDayPick],
  );

  return (
    <div>
      <DayPicker
        // @ts-ignore
        classNames={styles}
        enableOutsideDays
        month={currentDate || new Date()}
        onDayClick={handleDayPick}
        selectedDays={day => DateUtils.isSameDay(selectedDay, day)}
        captionElement={props => <CaptionElement {...props} />}
        navbarElement={props => <NavbarElement {...props} />}
      />
      {typeof renderContentFooter == 'function'
        ? renderContentFooter(close, currentDate)
        : null}
    </div>
  );
};

DatePickerContent.displayName = displayName;

export default DatePickerContent;
