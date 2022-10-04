import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { defineMessages } from 'react-intl';
import { flip, useFloating } from '@floating-ui/react-dom';
import classnames from 'classnames';

import Icon from '~core/Icon';

import { DEFAULT_TIME_FORMAT } from './constants';

import styles from './DatePicker.css';

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
  timeInterval: number;
  minDate?: Date | null;
  maxDate?: Date | null;
}

const TimePicker = ({
  selectedDate,
  onChange,
  timeInterval,
  minDate,
  maxDate,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, reference, floating, strategy, update } = useFloating({
    placement: 'bottom',
    middleware: [flip()],
  });

  /** Recalculate time dropdown positioning when selectedDate changes */
  useEffect(() => {
    update();
  }, [selectedDate, update]);

  /** Scroll the selected option into view upon opening the dropdown */
  const selectedOptionRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!isOpen || !selectedOptionRef.current) {
      return;
    }

    selectedOptionRef.current.scrollIntoView();
  }, [isOpen]);

  const formattedTime = useMemo(
    () => format(selectedDate, DEFAULT_TIME_FORMAT),
    [selectedDate],
  );

  const timeOptions = useMemo(() => {
    const optionsCount = (24 * 60) / timeInterval;
    return [...new Array(optionsCount)].map((_, idx) => {
      const time = idx * timeInterval;
      const hours = Math.floor(time / 60);
      const minutes = time % 60;

      const date = new Date(selectedDate);
      date.setHours(hours);
      date.setMinutes(minutes);

      return date;
    });
  }, [selectedDate, timeInterval]);

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
          <Icon name="caret-down-small" title={MSG.expandIconHTMLTitle} />
        </span>
      </button>

      {isOpen && (
        <div
          className={styles.timeDropdown}
          ref={floating}
          style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
        >
          {timeOptions.map((option) => {
            const isSelected = isSameTimeOption(option, selectedDate);

            return (
              <button
                type="button"
                key={option.toString()}
                className={classnames(styles.timeOption, {
                  [styles.selected]: isSelected,
                })}
                onClick={() => onChange(option)}
                ref={isSelected ? selectedOptionRef : null}
                disabled={
                  (!!minDate && option < minDate) ||
                  (!!maxDate && option > maxDate)
                }
              >
                {format(option, DEFAULT_TIME_FORMAT)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimePicker;
