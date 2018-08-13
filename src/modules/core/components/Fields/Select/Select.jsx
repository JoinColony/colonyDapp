import 'core-js/fn/array/find-index';
import React, { Component, PropTypes } from 'react';

import Icon from '../../Icon';
import { InputLabel } from '../InputLabel';
import SelectListBox from './SelectListBox.jsx';

import styles from './Select.css';

import { DOWN, ENTER, ESC, SPACE, UP, TAB } from '../../../../keyTypes';

class Select extends Component {
  static displayName = 'core.Fields.Select';
  static propTypes = {
    elementOnly: PropTypes.bool,
    error: PropTypes.string,
    hasError: PropTypes.bool,
    help: PropTypes.string,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    options: PropTypes.array,
    utils: PropTypes.object,
  };
  static defaultProps = {
    options: [],
  };
  constructor(props, context) {
    super(props, context);
    this.checkOption = this.checkOption.bind(this);
    this.close = this.close.bind(this);
    this.getCheckedOption = this.getCheckedOption.bind(this);
    this.goUp = this.goUp.bind(this);
    this.goDown = this.goDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyOnOpen = this.handleKeyOnOpen.bind(this);
    this.handleKeyOnClosed = this.handleKeyOnClosed.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.open = this.open.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      checkedOption: this.getCheckedOption(props.input.value),
      selectedOption: -1,
      loading: false,
    };
  }
  componentWillReceiveProps({ input: { value: nextValue }}) {
    const { input: { value }} = this.props;
    if (value !== nextValue) {
      this.setState({
        checkedOption: this.getCheckedOption(nextValue),
      });
    }
  }
  getCheckedOption(value) {
    return this.props.options.findIndex(option => option.value === value);
  }
  handleOutsideClick(evt) {
    if (this.wrapper && !this.wrapper.contains(evt.target)) {
      this.close();
    }
  }
  open() {
    if (this.props.input.disabled || this.state.loading) {
      return;
    }
    this.setState({ isOpen: true });
    document.body.addEventListener('click', this.handleOutsideClick, true);
  }
  close() {
    this.setState({ isOpen: false, selectedOption: -1 });
    if (this.combobox) {
      this.combobox.focus();
    }
    document.body.removeEventListener('click', this.handleOutsideClick, true);
  }
  goUp() {
    if (this.state.selectedOption > 0) {
      this.setState({ selectedOption: this.state.selectedOption -= 1 });
    }
  }
  goDown() {
    if (this.state.selectedOption < this.props.options.length - 1) {
      this.setState({ selectedOption: this.state.selectedOption += 1 });
    }
  }
  handleKeyOnOpen(evt) {
    const { key } = evt;
    switch (key) {
      case SPACE: return this.close();
      case UP: return this.goUp();
      case DOWN: return this.goDown();
      case TAB: return this.checkOption();
      case ENTER: {
        // Do not submit form
        evt.preventDefault();
        return this.checkOption();
      }
      default:
    }
  }
  handleKeyOnClosed(evt) {
    const { key } = evt;
    if ([UP, DOWN, SPACE].indexOf(key) > -1) {
      this.setState({ selectedOption: this.state.checkedOption });
      return this.open();
    }
  }
  handleKeyUp(evt) {
    // Special keyUp handling for ESC (modals)
    const { isOpen } = this.state;
    const { key } = evt;
    if (isOpen && key === ESC) {
      evt.stopPropagation();
      return this.close();
    }
  }
  handleKeyDown(evt) {
    const { isOpen } = this.state;
    if (isOpen) {
      return this.handleKeyOnOpen(evt);
    }
    return this.handleKeyOnClosed(evt);
  }
  toggle() {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  async checkOption() {
    const { selectedOption, checkedOption } = this.state;
    if (selectedOption === checkedOption || selectedOption === -1) {
      // No change
      return;
    }
    const { input: { onChange }, options } = this.props;
    const { value } = options[selectedOption];
    this.setState({ loading: true });
    try {
      await onChange(value);
    } catch (e) {
      // Do nothing (error handling happens in the action creator)
    } finally {
      this.setState({ loading: false });
      this.close();
    }
  }
  selectOption(idx) {
    this.setState({ selectedOption: idx });
  }
  // eslint-disable-next-line complexity
  render() {
    const {
      elementOnly,
      error,
      hasError,
      help,
      input: { placement, ...input },
      label,
      options,
      utils,
    } = this.props;

    const { isOpen, loading, checkedOption, selectedOption } = this.state;
    const activeOption = options[checkedOption];
    const listboxId = `select-listbox-${input.id}`;
    const activeOptionLabel = utils.getIntlFormatted(activeOption && activeOption.label);
    return (
      <div className={styles.main} onKeyUp={this.handleKeyUp} onKeyDown={this.handleKeyDown} ref={e => { this.wrapper = e; }}>
        {!elementOnly && label ?
          <InputLabel id={input.id} label={label} error={hasError && error} help={help} />
          :
          null
        }
        <div
          {...input}
          className={styles.select}
          role="combobox"
          aria-controls={input.id}
          aria-owns={listboxId}
          aria-expanded={isOpen}
          aria-label={elementOnly ? label : null}
          aria-labelledby={!elementOnly ? `${input.id}_label` : null}
          aria-disabled={input.disabled}
          aria-busy={loading}
          tabIndex="0"
          onClick={this.toggle}
          ref={e => { this.combobox = e; }}
        >
          <div className={styles.activeOption}>
            <span>{activeOptionLabel || input.placeholder}</span>
          </div>
          <span className={styles.loadingContainer}>
            { loading ?
              <span className={styles.loading} />
              :
              <Icon
                name="arrow-down-small"
                role="presentation"
                size="small"
              />
            }
          </span>
        </div>
        { isOpen && options.length &&
          <SelectListBox
            checkedOption={checkedOption}
            selectedOption={selectedOption}
            listboxId={listboxId}
            options={options}
            onSelect={this.selectOption}
            onClick={this.checkOption}
            placement={placement}
            utils={utils}
          />
        }
      </div>
    );
  }
}

export default Select;