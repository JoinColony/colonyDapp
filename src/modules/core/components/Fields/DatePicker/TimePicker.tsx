import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns/esm';
import { defineMessages } from 'react-intl';
import { useFloating } from '@floating-ui/react-dom';
import classnames from 'classnames';

import Icon from '~core/Icon';
import styles from './DatePicker.css';
import { TIME_FORMAT } from './constants';

const MSG = defineMessages({
  expandIconHTMLTitle: {
    id: 'DatePicker.TimePicker.expandIconHTMLTitle',
    defaultMessage: 'expand',
  },
});

const isSameTimeOption = (dateA: Date, dateB: Date) =>
  dateA.getUTCHours() === dateB.getUTCHours() &&
  dateA.getUTCMinutes() === dateB.getUTCMinutes();

interface Props {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const TimePicker = ({ selectedDate, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, reference, floating, strategy, update } = useFloating({
    placement: 'bottom',
  });

  /** Recalculate time dropdown positioning when selectedDate changes */
  useEffect(() => {
    update();
  }, [selectedDate, update]);

  const formattedTime = useMemo(() => format(selectedDate, TIME_FORMAT), [
    selectedDate,
  ]);

  const timeOptions = useMemo(() => {
    const interval = 30;

    return [...new Array((24 * 60) / 30)].map((_, idx) => {
      const time = idx * interval;
      const hours = Math.floor(time / 60);
      const minutes = time % 60;

      const date = new Date(selectedDate);
      date.setUTCHours(hours);
      date.setUTCMinutes(minutes);

      return date;
    });
  }, [selectedDate]);

  return (
    <div className={styles.timePicker}>
      <button
        type="button"
        className={styles.timeButton}
        onClick={() => setIsOpen(!isOpen)}
        ref={reference}
      >
        <span className={styles.selectedTime}>
          <div className={styles.clockIcon}>
            <Icon name="clock" />
          </div>
          {formattedTime}
        </span>

        <span className={styles.expandTimeIcon}>
          <Icon name="caret-down" title={MSG.expandIconHTMLTitle} />
        </span>
      </button>

      {isOpen && (
        <div
          className={styles.timeDropdown}
          ref={floating}
          style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
        >
          {timeOptions.map((option) => (
            <button
              type="button"
              key={option.toString()}
              className={classnames(styles.timeOption, {
                [styles.selected]: isSameTimeOption(option, selectedDate),
              })}
              onClick={() => onChange(option)}
            >
              {format(option, TIME_FORMAT)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimePicker;
