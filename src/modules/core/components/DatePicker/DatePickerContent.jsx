/* @flow */

import type { Node } from 'react';

// $FlowFixMe Upgrade flow
import React, { useCallback } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';

import type { Close } from './DatePicker.jsx';

import CaptionElement from './CaptionElement.jsx';
import NavbarElement from './NavbarElement.jsx';

import styles from './DatePickerContent.css';

type Props = {|
  close: Close,
  closeOnDayPick?: boolean,
  currentDate: ?Date,
  onDayPick: (day: Date) => void,
  selectedDay: ?Date,
  renderContentFooter?: (close: Close, currentDate: ?Date) => Node,
|};

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
