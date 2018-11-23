// @flow
import type { MessageDescriptor, MessageValues } from 'react-intl';

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
    labelValues?: MessageValues,
  },
  selected: boolean,
  onSelect: (idx: number) => void,
  onClick: () => void,
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: MessageValues,
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
    const label = formatIntl(option.label, option.labelValues);
    return (
      <li
        className={styles.main}
        aria-selected={selected}
        id={id}
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
