import React from 'react';

import { getMainClasses } from '~utils/css';

import SelectOption from '../SelectOption';
import { Appearance, SelectOption as SelectOptionType } from './types';

import styles from './SelectListBox.css';

const displayName = 'SelectListBox';

interface Props {
  appearance?: Appearance;
  checkedOption: number;
  listboxId: string;
  options: SelectOptionType[];
  selectedOption: number;
  name: string;
  onSelect: (idx: number) => void;
  onClick: () => void;
}

const getOptionId = (name, idx) =>
  idx >= 0 ? `${name}-listbox-entry-${idx}` : '';

const SelectListBox = ({
  appearance,
  listboxId,
  options,
  selectedOption,
  checkedOption,
  onSelect,
  onClick,
  name,
}: Props) => {
  const activeDescendantOption = options.find(
    (_, idx) => selectedOption === idx,
  );
  const activeDescendantIdx = activeDescendantOption
    ? options.findIndex(
        (option) => option.value === activeDescendantOption.value,
      )
    : -1;
  return (
    <ul
      tabIndex={0}
      className={getMainClasses(appearance, styles)}
      role="listbox"
      aria-activedescendant={getOptionId(name, activeDescendantIdx)}
      id={listboxId}
    >
      {options.map((option, idx) => (
        <SelectOption
          bordered={appearance ? appearance.borderedOptions === 'true' : false}
          id={getOptionId(name, idx)}
          idx={idx}
          key={getOptionId(name, idx)}
          selected={selectedOption === idx}
          checked={checkedOption === idx}
          option={option}
          onSelect={onSelect}
          onClick={onClick}
        />
      ))}
    </ul>
  );
};

SelectListBox.displayName = displayName;

export default SelectListBox;
