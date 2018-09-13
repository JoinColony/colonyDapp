/* @flow */
import type { MessageDescriptor } from 'react-intl';

import React from 'react';

import { getMainClasses } from '~utils/css';

import styles from './SelectListBox.css';

import SelectOption from '../SelectOption';

import type { Appearance } from './types';

const displayName = 'SelectListBox';

type Props = {
  appearance: Appearance,
  checkedOption: number,
  listboxId: string,
  options: Array<{
    label: MessageDescriptor | string,
    value: string,
  }>,
  selectedOption: number,
  ariaLabelledby: string,
  onSelect: (idx: number) => void,
  onClick: () => void,
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
  ariaLabelledby,
}: Props) => {
  const activeDescendant = options.find((_, idx) => checkedOption === idx);
  const activeDescendantLabel = activeDescendant
    ? activeDescendant.value
    : null;
  return (
    <ul // eslint-disable-line jsx-a11y/aria-activedescendant-has-tabindex
      tabIndex={-1}
      className={getMainClasses(appearance, styles)}
      role="listbox"
      aria-activedescendant={activeDescendantLabel}
      id={listboxId}
      aria-labelledby={ariaLabelledby}
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
};

SelectListBox.displayName = displayName;

export default SelectListBox;
