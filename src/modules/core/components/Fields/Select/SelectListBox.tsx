import React, { ReactNode } from 'react';

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
  optionsFooter?: ReactNode;
  selectedOption: number;
  name: string;
  onSelect: (idx: number) => void;
  onClick: () => void;
  dataTest?: string;
}

const getOptionId = (name, idx) =>
  idx >= 0 ? `${name}-listbox-entry-${idx}` : '';

const SelectListBox = ({
  appearance,
  listboxId,
  options,
  optionsFooter,
  selectedOption,
  checkedOption,
  onSelect,
  onClick,
  name,
  dataTest,
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
    // We're safe to disable this eslint rule - if this were a standard listbox (as opposed to collapsible, as it is now) we'd want this element to be tabbable
    // eslint-disable-next-line jsx-a11y/aria-activedescendant-has-tabindex
    <ul
      tabIndex={-1}
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
          dataTest={dataTest}
        />
      ))}
      {optionsFooter}
    </ul>
  );
};

SelectListBox.displayName = displayName;

export default SelectListBox;
