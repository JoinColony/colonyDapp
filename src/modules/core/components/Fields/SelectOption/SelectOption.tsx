import { MessageDescriptor, defineMessages } from 'react-intl';
import React, { Component, SyntheticEvent, KeyboardEvent } from 'react';

import { SimpleMessageValues } from '~types/index';

import { AsFieldEnhancedProps } from '../types';

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
  option: {
    label: MessageDescriptor | string;
    value: string;
    labelValues?: SimpleMessageValues;
  };
  selected: boolean;
  onSelect: (idx: number) => void;
  onClick: () => void;
  formatIntl: AsFieldEnhancedProps['formatIntl'];
}

class SelectOption extends Component<Props> {
  static displayName = 'SelectOption';

  handleItemClick = (evt: SyntheticEvent<HTMLElement>) => {
    const { onClick } = this.props;
    evt.stopPropagation();
    onClick();
  };

  handleItemKeyPress = (evt: KeyboardEvent<any>) => {
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
