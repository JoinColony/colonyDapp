import React, { KeyboardEvent, SyntheticEvent, useCallback } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { SelectOption as SelectOptionType } from '../Select/types';

import styles from './SelectOption.css';

const MSG = defineMessages({
  selectedLabelHelp: {
    id: 'Select.SelectOption.selectedLabelHelp',
    defaultMessage: 'selected',
  },
});

interface Props {
  checked: boolean;
  id: string;
  idx: number;
  option: SelectOptionType;
  selected: boolean;
  onSelect: (idx: number) => void;
  onClick: () => void;
}

const displayName = 'SelectOption';

const SelectOption = ({
  checked,
  id,
  idx,
  onClick,
  onSelect,
  option,
  selected,
}: Props) => {
  const { formatMessage } = useIntl();

  const handleItemClick = useCallback(
    (evt: SyntheticEvent<HTMLElement>) => {
      evt.stopPropagation();
      onClick();
    },
    [onClick],
  );

  const handleItemKeyPress = useCallback(
    (evt: KeyboardEvent<any>) => {
      evt.stopPropagation();
      onClick();
    },
    [onClick],
  );

  const handleItemSelect = useCallback(() => {
    onSelect(idx);
  }, [idx, onSelect]);

  const label =
    typeof option.label === 'object'
      ? formatMessage(option.label, option.labelValues)
      : option.label;
  return (
    <li
      className={styles.main}
      aria-disabled={option.disabled}
      aria-selected={selected}
      id={id}
      role="option"
      ref={(e) => selected && e && e.focus()}
      onClick={handleItemClick}
      onKeyPress={handleItemKeyPress}
      onMouseEnter={handleItemSelect}
    >
      <span title={label}>
        {option.children || (
          <>
            {label}
            {checked && (
              <small className={styles.selectedHelpText}>
                ({formatMessage(MSG.selectedLabelHelp)})
              </small>
            )}
          </>
        )}
      </span>
    </li>
  );
};

SelectOption.displayName = displayName;

export default SelectOption;
