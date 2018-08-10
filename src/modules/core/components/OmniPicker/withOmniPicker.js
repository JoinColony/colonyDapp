/* @flow */

import type { ComponentType } from 'react';

import { createElement, Component } from 'react';

import nanoid from 'nanoid';

import { ESC, TAB, UP, DOWN, ENTER } from './keyTypes';

import type { Data } from './types';

import OmniPicker from './OmniPicker.jsx';

type WrapperProps = {
  id: string,
  role: 'combobox',
  'aria-haspopup': 'listbox',
  'aria-expanded': boolean,
};

type WrappedComponentProps = {
  OmniPicker: OmniPicker,
  inputProps: {
    id: string,
    autoComplete: 'off',
    onKeyUp: (evt: SyntheticKeyboardEvent<HTMLElement>) => void,
    onKeyDown: (evt: SyntheticKeyboardEvent<HTMLElement>) => void,
    onFocus: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
    onBlur: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
    onChange: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
    value: string,
    'aria-autocomplete': 'list',
    'aria-controls': string,
    'aria-activedescendant': string,
  },
  registerInputNode: (inputNode: ?HTMLInputElement) => void,
  OmniPickerWrapper: ComponentType<WrapperProps>,
};

type Opts = {
  data: any,
  filter: (data: any, filterStr: string) => Array<Data>,
  getItem?: (data: Array<Data>, selectedIdx: number) => Data,
};

type State = {
  isOpen: boolean,
  filterValue: string,
  selected: number,
  keyUsed: boolean,
};

const getClass = (
  WrappedComponent,
  {
    data,
    filter,
    getItem = (filteredData: Array<Data>, selectedIdx: number) =>
      filteredData[selectedIdx],
  },
) => {
  const getFilteredData = (props, filterValue) => {
    const result = typeof data == 'function' ? data(props) : data;
    return filter(result, filterValue);
  };

  class OmniPickerBase extends Component<Object, State> {
    id: string;

    inputNode: ?HTMLInputElement;

    omniPicker: ?OmniPicker;

    constructor(props: {}) {
      super(props);
      this.id = nanoid(6);
    }

    state = {
      isOpen: false,
      filterValue: '',
      selected: -1,
      keyUsed: false,
    };

    registerInputNode = (inputNode: ?HTMLInputElement) => {
      this.inputNode = inputNode;
    };

    registerOmniPicker = (omniPicker: ?OmniPicker) => {
      this.omniPicker = omniPicker;
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
        },
      );
    };

    close = () => {
      this.setState(
        {
          isOpen: false,
        },
        () => {
          if (this.omniPicker) {
            this.omniPicker.handleClose();
          }
          if (this.inputNode) {
            this.inputNode.blur();
          }
        },
      );
    };

    reset = () => {
      this.setState(
        {
          isOpen: false,
          filterValue: '',
        },
        () => {
          if (this.omniPicker) {
            this.omniPicker.handleReset();
          }
          if (this.inputNode) {
            this.inputNode.blur();
          }
        },
      );
    };

    setFilterValue = (value: string) => {
      this.setState({ filterValue: value });
    };

    keyUp = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
      if (this.omniPicker) {
        this.omniPicker.handleKeyUp(evt);
      }
      const { key } = evt;
      const { isOpen } = this.state;
      if (key === ESC && isOpen) {
        evt.preventDefault();
        evt.stopPropagation();
        this.reset();
      }
    };

    keyDown = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
      if (this.omniPicker) {
        this.omniPicker.handleKeyDown(evt);
      }
      const { key } = evt;
      const { isOpen } = this.state;
      if (key === TAB) return this.close();
      if (key === UP && isOpen) {
        evt.preventDefault();
        return this.goUp();
      }
      if (key === DOWN && isOpen) {
        evt.preventDefault();
        return this.goDown();
      }
      if (key === ENTER && isOpen) {
        evt.preventDefault();
        return this.choose();
      }
      return null;
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

    blur = (evt: SyntheticInputEvent<HTMLInputElement>) => {
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
      const { filterValue, selected } = this.state;
      const filteredData = getFilteredData(this.props, filterValue);
      const next = getItem(filteredData, selected + 1);
      if (next) {
        this.setState({
          keyUsed: true,
          selected: selected + 1,
        });
      }
    };

    choose = () => {
      const { filterValue, selected } = this.state;
      const filteredData = getFilteredData(this.props, filterValue);
      if (selected < 0) return;
      const itemData = getItem(filteredData, selected);
      if (this.omniPicker) {
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

    getOmniPicker = (props: {}) => {
      const { isOpen, keyUsed, filterValue, selected } = this.state;
      const filteredData = getFilteredData(this.props, filterValue);
      const { id } = this;
      return (
        isOpen &&
        createElement(OmniPicker, {
          ...props,
          ref: this.registerOmniPicker,
          getItem,
          id,
          inputRef: this.inputNode,
          keyUsed,
          filteredData,
          choose: this.choose,
          close: this.close,
          select: this.select,
          selected,
        })
      );
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
      const props = {
        ...this.props,
        OmniPicker: this.getOmniPicker,
        OmniPickerWrapper: this.getWrapper,
        inputProps: this.getInputProps(),
        registerInputNode: this.registerInputNode,
      };
      return createElement(WrappedComponent, props);
    }
  }
  return OmniPickerBase;
};

const withOmniPicker = (opts: Opts) => (
  WrappedComponent: ComponentType<WrappedComponentProps>,
) => getClass(WrappedComponent, opts);

export default withOmniPicker;
