import React, { ReactNode, useCallback } from 'react';
// @ts-ignore (version troubles?)
import DayPicker, { DateUtils } from 'react-day-picker';

import { Close } from './DatePicker';
import CaptionElement from './CaptionElement';
import NavbarElement from './NavbarElement';

import styles from './DatePickerContent.css';

interface Props {
  close: Close;
  closeOnDayPick?: boolean;
  currentDate?: Date;
  onDayPick: (day: Date) => void;
  selectedDay?: Date;
  renderContentFooter?: (close: Close, currentDate?: Date) => ReactNode;
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
    (day) => {
      onDayPick(day);
      if (closeOnDayPick) {
        close(day);
      }
    },
    [close, closeOnDayPick, onDayPick],
  );

  const isSelectedDay = useCallback(
    (day) => {
      if (selectedDay) {
        return DateUtils.isSameDay(selectedDay, day) ? day : undefined;
      }
      return undefined;
    },
    [selectedDay],
  );

  return (
    <div>
      <DayPicker
        classNames={styles}
        month={currentDate || new Date()}
        onDayClick={handleDayPick}
        selectedDays={isSelectedDay}
        captionElement={(props) => <CaptionElement {...props} />}
        navbarElement={(props) => <NavbarElement {...props} />}
      />
      {typeof renderContentFooter == 'function'
        ? renderContentFooter(close, currentDate)
        : null}
    </div>
  );
};

DatePickerContent.displayName = displayName;

export default DatePickerContent;
