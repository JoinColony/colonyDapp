import React, { Component, PropTypes } from 'react';

import styles from './SelectOption.css';

class SelectOption extends Component {
  static displayName = 'core.Fields.Select.SelectOption';
  static propTypes = {
    checked: PropTypes.bool,
    id: PropTypes.string,
    idx: PropTypes.number,
    option: PropTypes.object,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    utils: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleItemSelect = this.handleItemSelect.bind(this);
  }
  handleItemClick(evt) {
    evt.stopPropagation();
    this.props.onClick();
  }
  handleItemSelect() {
    const { idx, onSelect } = this.props;
    onSelect(idx);
  }
  render() {
    const { checked, id, option, selected, utils } = this.props;
    const label = utils.getIntlFormatted(option.label);
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
        onMouseEnter={this.handleItemSelect}
      >
        <span title={label}>{label}</span>
      </li>
    );
  }
}

export default SelectOption;