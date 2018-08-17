// @flow
import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import styles from './SelectOption.css';

const MSG = defineMessages({
  selectedLabelHelp: {
    id: 'Select.SelectOption.selectedLabelHelp',
    defaultMessage: 'selected',
  },
});

type Props = {
  checked: boolean,
  id: string,
  idx: number,
  option: {
    label: MessageDescriptor | string,
    value: string,
  },
  selected: boolean,
  onSelect: Function,
  onClick: Function,
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: { [string]: string },
  ) => string,
};

class SelectOption extends Component<Props> {
  static displayName = 'SelectOption';

  handleItemClick = (evt: SyntheticEvent<HTMLElement>) => {
    const { onClick } = this.props;
    evt.stopPropagation();
    onClick();
  };

  handleItemKeyPress = (evt: SyntheticKeyboardEvent<*>) => {
    const { onClick } = this.props;
    evt.stopPropagation();
    onClick();
  };

  handleItemSelect = () => {
    const { idx, onSelect } = this.props;
    onSelect(idx);
  };

  render() {
    const { checked, id, option, selected, formatIntl } = this.props;
    const label = formatIntl(option.label);
    return (
      <li
        className={styles.main}
        aria-selected={selected}
        aria-checked={checked}
        id={id}
        tabIndex="-1"
        role="option"
        ref={e => selected && e && e.focus()}
        onClick={this.handleItemClick}
        onKeyPress={this.handleItemKeyPress}
        onMouseEnter={this.handleItemSelect}
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
  }
}

export default SelectOption;
