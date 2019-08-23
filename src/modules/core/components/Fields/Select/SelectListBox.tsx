import { MessageDescriptor, MessageValues } from 'react-intl';
import React from 'react';

import { getMainClasses } from '~utils/css';

import styles from './SelectListBox.css';

import SelectOption from '../SelectOption';

import { Appearance } from './types';

const displayName = 'SelectListBox';

interface Props {
  appearance: Appearance;
  checkedOption: number;
  listboxId: string;
  options: {
    label: MessageDescriptor | string;
    value: string;
    labelValues?: MessageValues;
  }[];
  selectedOption: number;
  ariaLabelledby: string;
  name: string;
  onSelect: (idx: number) => void;
  onClick: () => void;
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: MessageValues,
  ) => string;
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
  formatIntl,
  ariaLabelledby,
  name,
}: Props) => {
  const activeDescendantOption = options.find(
    (_, idx) => selectedOption === idx,
  );
  const activeDescendantIdx = activeDescendantOption
    ? options.findIndex(option => option.value === activeDescendantOption.value)
    : -1;
  return (
    <ul
      tabIndex={0}
      className={getMainClasses(appearance, styles)}
      role="listbox"
      aria-activedescendant={getOptionId(name, activeDescendantIdx)}
      id={listboxId}
      aria-labelledby={ariaLabelledby}
    >
      {options.map((option, idx) => (
        <SelectOption
          id={getOptionId(name, idx)}
          idx={idx}
          key={getOptionId(name, idx)}
          selected={selectedOption === idx}
          checked={checkedOption === idx}
          option={option}
          onSelect={onSelect}
          onClick={onClick}
          formatIntl={formatIntl}
        />
      ))}
    </ul>
  );
};

SelectListBox.displayName = displayName;

export default SelectListBox;
