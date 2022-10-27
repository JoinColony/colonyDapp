import React, {
  KeyboardEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import { SelectOption as SelectOptionType } from '../Select/types';

import styles from './SelectOption.css';

const MSG = defineMessages({
  selectedLabelHelp: {
    id: 'Select.SelectOption.selectedLabelHelp',
    defaultMessage: 'selected',
  },
});

interface Props {
  bordered?: boolean;
  checked: boolean;
  id: string;
  idx: number;
  option: SelectOptionType;
  selected: boolean;
  onSelect: (idx: number) => void;
  onClick: () => void;
  dataTest?: string;
}

const displayName = 'SelectOption';

const SelectOption = ({
  bordered,
  checked,
  id,
  idx,
  onClick,
  onSelect,
  option,
  selected,
  dataTest,
}: Props) => {
  const ref = useRef<HTMLLIElement>(null);

  /** Scroll to the currently checked item */
  useEffect(() => {
    if (!ref.current?.parentElement || !checked) {
      return;
    }
    ref.current.parentElement.scrollTop = ref.current.offsetTop;
  }, [checked]);

  useEffect(() => {
    if (!ref.current || !selected) {
      return;
    }
    ref.current.focus();
  }, [selected]);

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
      className={getMainClasses({}, styles, {
        bordered: !!bordered,
        isBasicLabel: !option.children,
      })}
      aria-disabled={option.disabled}
      aria-selected={selected}
      id={id}
      role="option"
      ref={ref}
      onClick={handleItemClick}
      onKeyPress={handleItemKeyPress}
      onMouseEnter={handleItemSelect}
      data-checked={checked}
      data-test={dataTest}
      title={label}
    >
      {option.children || (
        <div className={styles.labelContainer}>
          <span className={styles.label}>{label}</span>
          {checked && (
            <small className={styles.selectedHelpText}>
              ({formatMessage(MSG.selectedLabelHelp)})
            </small>
          )}
        </div>
      )}
    </li>
  );
};

SelectOption.displayName = displayName;

export default SelectOption;
