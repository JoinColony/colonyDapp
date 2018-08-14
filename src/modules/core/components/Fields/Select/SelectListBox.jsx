/* @flow */
import React from 'react';

import type { MessageDescriptor } from 'react-intl';
import type { Appearance, SelectOptionType } from './types';

import { getMainClasses } from '~utils/css';

import SelectOption from '../SelectOption';
import styles from './SelectListBox.css';

const displayName = 'core.Fields.Select.SelectListBox';

type Props = {
  appearance: Appearance,
  checkedOption: number,
  listboxId: string,
  options: Array<SelectOptionType>,
  selectedOption: number,
  onSelect: Function,
  onClick: Function,
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: { [string]: string },
  ) => string,
};

const SelectListBox = ({
  appearance,
  listboxId,
  options,
  selectedOption,
  checkedOption,
  onSelect,
  onClick,
  formatIntl,
}: Props) => (
  <ul
    className={getMainClasses(appearance, styles)}
    role="listbox"
    id={listboxId}
  >
    {options.map((option, idx) => (
      <SelectOption
        id={`${listboxId}-option-${idx}`}
        idx={idx}
        key={`${listboxId}-option-${option.value}`}
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

SelectListBox.displayName = displayName;

export default SelectListBox;
