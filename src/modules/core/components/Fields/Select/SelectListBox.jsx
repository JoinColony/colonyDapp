import React, { PropTypes } from 'react';

import { SelectOption } from '../SelectOption';
import styles from './SelectListBox.css';

const displayName = 'core.Fields.Select.SelectListBox';

const propTypes = {
  checkedOption: PropTypes.number,
  listboxId: PropTypes.string,
  options: PropTypes.array,
  placement: PropTypes.string,
  utils: PropTypes.object,
  selectedOption: PropTypes.number,
  theme: PropTypes.string,
  onSelect: PropTypes.func,
  onClick: PropTypes.func,
};

const getPlacementStyle = placement => {
  if (placement === 'left') {
    return { right: '0' };
  } else if (placement === 'right') {
    return { left: '0' };
  }
  return { left: '50%', transform: 'translate(-50%)' };
};

const SelectListBox = ({ listboxId, options, selectedOption, checkedOption, onSelect, onClick, placement, utils, theme }) => (
  <ul className={styles[theme] || styles.main} role="listbox" id={listboxId} style={getPlacementStyle(placement)}>
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
        utils={utils}
      />
    ))}
  </ul>
);

SelectListBox.displayName = displayName;

SelectListBox.propTypes = propTypes;

export default SelectListBox;