/* @flow */

import { Component } from 'react';
import nanoid from 'nanoid';

import { ESC, TAB, UP, DOWN, ENTER } from './keyTypes';

import type { Data, ItemComponentType } from './types';

import OmniPickerDropdown from './OmniPickerDropdown.jsx';

type Props = {
  data: any,
  filter: (data: any, filterStr: string) => Array<Data>,
  getItem?: (data: Array<Data>, selectedIdx: number) => Data,
  itemComponent: ItemComponentType,
};

type State = {
  omniPickerOpen: boolean,
  omniPickerFilterValue: string,
};

class OmniPicker extends Component<Props, State> {
  id: string;

  inputNode: ?HTMLInputElement;

  omniPicker: OmniPickerDropdown;

  onOmniPickerOpen: (() => void) | void;

  onOmniPickerClose: (() => void) | void;

  onOmniPickerReset: (() => void) | void;

  onDataSelect: ((data: any) => void) | void;

  onOmniPickerKeyUp:
    | ((evt: SyntheticKeyboardEvent<HTMLElement>) => void)
    | void;

  onOmniPickerKeyDown:
    | ((evt: SyntheticKeyboardEvent<HTMLElement>) => void)
    | void;

  onOmniPickerChange:
    | ((evt: SyntheticInputEvent<HTMLInputElement>) => void)
    | void;

  onOmniPickerBlur:
    | ((evt: SyntheticInputEvent<HTMLInputElement>) => void)
    | void;

  onOmniPickerFocus:
    | ((evt: SyntheticInputEvent<HTMLInputElement>) => void)
    | void;

  static displayName = 'OmniPicker';

  constructor(props: Props) {
    super(props);
    this.id = nanoid(6);
  }

  state = {
    omniPickerOpen: false,
    omniPickerFilterValue: '',
  };

  registerOmniPicker = (currentOmniPicker: OmniPickerDropdown) => {
    this.omniPicker = currentOmniPicker;
  };

  registerInputNode = (inputNode: ?HTMLInputElement) => {
    this.inputNode = inputNode;
  };

  openOmniPicker = () => {
    this.setState(
      {
        omniPickerOpen: true,
      },
      () => {
        if (typeof this.onOmniPickerOpen === 'function')
          this.onOmniPickerOpen();
      },
    );
  };

  closeOmniPicker = () => {
    this.setState(
      {
        omniPickerOpen: false,
      },
      () => {
        if (typeof this.onOmniPickerClose === 'function') {
          this.onOmniPickerClose();
        }
        if (this.inputNode) {
          this.inputNode.blur();
        }
      },
    );
  };

  resetOmniPicker = () => {
    this.setState(
      {
        omniPickerOpen: false,
        omniPickerFilterValue: '',
      },
      () => {
        if (typeof this.onOmniPickerReset === 'function') {
          this.onOmniPickerReset();
        }
        if (this.inputNode) {
          this.inputNode.blur();
        }
      },
    );
  };

  setOmniPickerFilterValue = (value: string) => {
    this.setState({ omniPickerFilterValue: value });
  };

  dataSelect = (data: any) => {
    if (typeof this.onDataSelect === 'function') {
      this.onDataSelect(data);
    }
  };

  omniPickerKeyUp = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
    if (typeof this.onOmniPickerKeyUp === 'function') {
      this.onOmniPickerKeyUp(evt);
    }
    const { key } = evt;
    const { omniPickerOpen } = this.state;
    if (key === ESC && omniPickerOpen) {
      evt.preventDefault();
      evt.stopPropagation();
      this.resetOmniPicker();
    }
  };

  omniPickerKeyDown = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
    if (typeof this.onOmniPickerKeyDown === 'function')
      this.onOmniPickerKeyDown(evt);
    const { key } = evt;
    const { omniPickerOpen } = this.state;
    if (key === TAB) return this.closeOmniPicker();
    if (key === UP && omniPickerOpen) {
      evt.preventDefault();
      return this.omniPicker.goUp();
    }
    if (key === DOWN && omniPickerOpen) {
      evt.preventDefault();
      return this.omniPicker.goDown();
    }
    if (key === ENTER && omniPickerOpen) {
      evt.preventDefault();
      return this.omniPicker.choose();
    }
    return null;
  };

  omniPickerChange = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    if (typeof this.onOmniPickerChange === 'function')
      this.onOmniPickerChange(evt);
    const { omniPickerOpen } = this.state;
    if (omniPickerOpen) this.setOmniPickerFilterValue(evt.currentTarget.value);
  };

  omniPickerFocus = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    this.openOmniPicker();
    if (typeof this.onOmniPickerFocus === 'function') {
      this.onOmniPickerFocus(evt);
    }
  };

  omniPickerBlur = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    if (typeof this.onOmniPickerBlur === 'function') this.onOmniPickerBlur(evt);
  };

  getOmniPickerWrapperProps = () => {
    const { omniPickerOpen } = this.state;
    const { id } = this;
    return {
      id: `omnipicker-${id}-combobox`,
      role: 'combobox',
      'aria-haspopup': 'listbox',
      'aria-expanded': omniPickerOpen,
    };
  };

  getOmniPickerInputProps = () => {
    const { omniPickerFilterValue } = this.state;
    const { id } = this;
    // TODO: we need to move the selected state into this component to get idx
    const idx = 0;
    return {
      id: `omnipicker-${id}-input`,
      autoComplete: 'off',
      onKeyUp: this.omniPickerKeyUp,
      onKeyDown: this.omniPickerKeyDown,
      onFocus: this.omniPickerFocus,
      onBlur: this.omniPickerBlur,
      onChange: this.omniPickerChange,
      value: omniPickerFilterValue,
      'aria-autocomplete': 'list',
      'aria-controls': `omnipicker-${id}-listbox`,
      'aria-activedescendant': `omnipicker-${id}-item-${idx}`,
    };
  };

  getOmniPickerDropdownProps = () => {
    const { data, filter, getItem, itemComponent } = this.props;
    const { omniPickerFilterValue } = this.state;
    const { id } = this;
    return {
      id,
      data,
      getItem,
      filter,
      itemComponent,
      inputRef: this.inputNode,
      filterValue: omniPickerFilterValue,
      onSelect: this.dataSelect,
      onReset: this.resetOmniPicker,
      onClose: this.closeOmniPicker,
      withRef: this.registerOmniPicker,
    };
  };
}

export default OmniPicker;
