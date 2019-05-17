/* @flow */

import type { ComponentType } from 'react';

import { createElement, Component } from 'react';
import nanoid from 'nanoid';

import type { Props as OmniPickerProps } from './OmniPicker.jsx';
import type { OmniPickerData } from './types';

import { ESC, TAB, UP, DOWN, ENTER } from './keyTypes';
import OmniPicker from './OmniPicker.jsx';

type Props = {
  data: any | (any => any),
  filter: (data: any, filterStr: string) => Array<OmniPickerData>,
  getItem: (data: Array<OmniPickerData>, selectedIdx: number) => OmniPickerData,
};

type State = {
  isOpen: boolean,
  filterValue: string,
  selected: number,
  keyUsed: boolean,
};

const getClass = WrappedComponent => {
  class OmniPickerBase extends Component<Props, State> {
    id: string;

    inputNode: ?HTMLInputElement;

    omniPicker: ?OmniPicker;

    static defaultProps = {
      getItem: (filteredData: Array<OmniPickerData>, selectedIdx: number) =>
        filteredData[selectedIdx],
    };

    constructor(props: Props) {
      super(props);
      this.id = nanoid(6);
    }

    state = {
      isOpen: false,
      filterValue: '',
      selected: 0,
      keyUsed: false,
    };

    registerInputNode = (inputNode: ?HTMLInputElement) => {
      this.inputNode = inputNode;
    };

    registerOmniPicker = (omniPicker: ?OmniPicker) => {
      this.omniPicker = omniPicker;
    };

    getFilteredData = () => {
      const { data, filter, ...props } = this.props;
      const { filterValue } = this.state;
      const result = typeof data == 'function' ? data(props) : data;
      return filter(result, filterValue);
    };

    open = () => {
      this.setState(
        {
          isOpen: true,
        },
        () => {
          if (this.omniPicker) {
            this.omniPicker.handleOpen();
          }
          if (this.inputNode) {
            this.inputNode.focus();
          }
        },
      );
    };

    close = (
      evt:
        | MouseEvent
        | SyntheticInputEvent<HTMLInputElement>
        | SyntheticKeyboardEvent<HTMLElement>,
    ) => {
      this.blur(evt);
      if (this.omniPicker) {
        this.omniPicker.handleClose();
      }
      this.setState({
        isOpen: false,
      });
    };

    reset = () => {
      if (this.omniPicker) {
        this.omniPicker.handleReset();
      }
      this.setState({
        isOpen: false,
        filterValue: '',
        selected: 0,
        keyUsed: false,
      });
    };

    setFilterValue = (value: string) => {
      this.setState({ filterValue: value });
    };

    keyUp = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
      if (this.omniPicker) {
        this.omniPicker.handleKeyUp(evt);
      }
    };

    keyDown = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
      if (this.omniPicker) {
        this.omniPicker.handleKeyDown(evt);
      }
      const { key } = evt;
      const { isOpen } = this.state;
      if (key === TAB) {
        evt.preventDefault();
        this.close(evt);
        return;
      }
      if (key === UP && isOpen) {
        evt.preventDefault();
        this.goUp();
        return;
      }
      if (key === DOWN && isOpen) {
        evt.preventDefault();
        this.goDown();
        return;
      }
      if (key === ENTER && isOpen) {
        evt.preventDefault();
        this.choose();
      }
      if (key === ESC && isOpen) {
        evt.preventDefault();
        evt.stopPropagation();
        this.blur(evt);
        this.reset();
      }
    };

    change = (evt: SyntheticInputEvent<HTMLInputElement>) => {
      if (this.omniPicker) {
        this.omniPicker.handleChange(evt);
      }
      const { isOpen } = this.state;
      if (isOpen) this.setFilterValue(evt.currentTarget.value);
    };

    focus = (evt: SyntheticInputEvent<HTMLInputElement>) => {
      this.open();
      if (this.omniPicker) {
        this.omniPicker.handleFocus(evt);
      }
    };

    blur = (
      evt:
        | MouseEvent
        | SyntheticInputEvent<HTMLInputElement>
        | SyntheticKeyboardEvent<HTMLElement>,
    ) => {
      if (this.omniPicker) {
        this.omniPicker.handleBlur(evt);
      }
    };

    goUp = () => {
      const { selected } = this.state;
      this.setState({
        keyUsed: true,
        selected: selected === 0 ? 0 : selected - 1,
      });
    };

    goDown = () => {
      const { getItem } = this.props;
      const { selected } = this.state;
      const filteredData = this.getFilteredData();
      const next = getItem(filteredData, selected + 1);
      if (next) {
        this.setState({
          keyUsed: true,
          selected: selected + 1,
        });
      }
    };

    choose = () => {
      const { getItem } = this.props;
      const { selected } = this.state;
      const filteredData = this.getFilteredData();
      if (selected < 0) return;
      const itemData = getItem(filteredData, selected);
      if (this.omniPicker && itemData) {
        this.omniPicker.handlePick(itemData);
      }
      this.reset();
    };

    select = (idx: number) => {
      this.setState({
        keyUsed: false,
        selected: idx,
      });
    };

    getOmniPicker = (omniPickerProps: OmniPickerProps) => {
      const { getItem } = this.props;
      const { isOpen, keyUsed, selected } = this.state;
      const filteredData = this.getFilteredData();
      const { id } = this;
      return isOpen
        ? createElement(OmniPicker, {
            ...omniPickerProps,
            choose: this.choose,
            close: this.close,
            filteredData,
            getItem,
            id,
            inputRef: this.inputNode,
            keyUsed,
            ref: this.registerOmniPicker,
            select: this.select,
            selected,
          })
        : null;
    };

    getWrapper = (props: {}) => {
      const { isOpen } = this.state;
      const { id } = this;
      return createElement('div', {
        ...props,
        id: `omnipicker-${id}-combobox`,
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-expanded': isOpen,
      });
    };

    getInputProps = () => {
      const { filterValue, selected } = this.state;
      const { id } = this;
      return {
        id: `omnipicker-${id}-input`,
        autoComplete: 'off',
        onKeyUp: this.keyUp,
        onKeyDown: this.keyDown,
        onFocus: this.focus,
        onBlur: this.blur,
        onChange: this.change,
        value: filterValue,
        'aria-autocomplete': 'list',
        'aria-controls': `omnipicker-${id}-listbox`,
        'aria-activedescendant': `omnipicker-${id}-item-${selected}`,
      };
    };

    render() {
      const { isOpen } = this.state;
      const props = {
        ...this.props,
        OmniPicker: this.getOmniPicker,
        OmniPickerWrapper: this.getWrapper,
        inputProps: this.getInputProps(),
        registerInputNode: this.registerInputNode,
        openOmniPicker: this.open,
        omniPickerIsOpen: isOpen,
      };
      return createElement(WrappedComponent, props);
    }
  }
  return OmniPickerBase;
};

const withOmniPicker = () => (WrappedComponent: ComponentType<*>) =>
  getClass(WrappedComponent);

export default withOmniPicker;
