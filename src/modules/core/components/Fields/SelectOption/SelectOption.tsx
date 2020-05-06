import React, { KeyboardEvent, SyntheticEvent, useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { SelectOption as SelectOptionType } from '../Select/types';

import { FieldEnhancedProps } from '../types';

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
  formatIntl: FieldEnhancedProps['formatIntl'];
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
  formatIntl,
}: Props) => {
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

  const label = formatIntl(option.label, option.labelValues);
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
        {label}
        {checked && (
          <small className={styles.selectedHelpText}>
            ({formatIntl(MSG.selectedLabelHelp)})
          </small>
        )}
      </span>
    </li>
  );
};

SelectOption.displayName = displayName;

export default SelectOption;
