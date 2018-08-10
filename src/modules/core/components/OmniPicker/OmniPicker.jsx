/* @flow */

import { Component } from 'react';
import nanoid from 'nanoid';

import { ESC, TAB, UP, DOWN, ENTER } from './keyTypes';

import type { Data, ItemComponentType } from './types';

type Props = {
  data: any,
  filter: (data: any, filterStr: string) => Array<Data>,
  getItem: (data: Array<Data>, selectedIdx: number) => Data,
  itemComponent: ItemComponentType,
};

type State = {
  omniPickerOpen: boolean,
  omniPickerFilterValue: string,
  selected: number,
  keyUsed: boolean,
};

class OmniPicker extends Component<Props, State> {
  id: string;

  inputNode: ?HTMLInputElement;

  onOmniPickerOpen: (() => void) | void;

  onOmniPickerClose: (() => void) | void;

  onOmniPickerReset: (() => void) | void;

  onOmniPickerPick: ((data: any) => void) | void;

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

  static defaultProps = {
    getItem: (filteredData: Array<Data>, selectedIdx: number) =>
      filteredData[selectedIdx],
  };

  constructor(props: Props) {
    super(props);
    this.id = nanoid(6);
  }

  state = {
    omniPickerOpen: false,
    omniPickerFilterValue: '',
    selected: -1,
    keyUsed: false,
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

  omniPickerClose = () => {
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

  omniPickerReset = () => {
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

  omniPickerKeyUp = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
    if (typeof this.onOmniPickerKeyUp === 'function') {
      this.onOmniPickerKeyUp(evt);
    }
    const { key } = evt;
    const { omniPickerOpen } = this.state;
    if (key === ESC && omniPickerOpen) {
      evt.preventDefault();
      evt.stopPropagation();
      this.omniPickerReset();
    }
  };

  omniPickerKeyDown = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
    if (typeof this.onOmniPickerKeyDown === 'function')
      this.onOmniPickerKeyDown(evt);
    const { key } = evt;
    const { omniPickerOpen } = this.state;
    if (key === TAB) return this.omniPickerClose();
    if (key === UP && omniPickerOpen) {
      evt.preventDefault();
      return this.omniPickerGoUp();
    }
    if (key === DOWN && omniPickerOpen) {
      evt.preventDefault();
      return this.omniPickerGoDown();
    }
    if (key === ENTER && omniPickerOpen) {
      evt.preventDefault();
      return this.omniPickerChoose();
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

  omniPickerGoUp = () => {
    const { selected } = this.state;
    this.setState({
      keyUsed: true,
      selected: selected === 0 ? 0 : selected - 1,
    });
  };

  omniPickerGoDown = () => {
    const { omniPickerFilterValue, selected } = this.state;
    const { data, filter, getItem } = this.props;
    const filteredData = filter(data, omniPickerFilterValue);
    const next = getItem(filteredData, selected + 1);
    if (next) {
      this.setState({
        keyUsed: true,
        selected: selected + 1,
      });
    }
  };

  omniPickerChoose = () => {
    const { data, getItem, filter } = this.props;
    const { omniPickerFilterValue, selected } = this.state;
    const filteredData = filter(data, omniPickerFilterValue);
    if (selected < 0) return;
    const itemData = getItem(filteredData, selected);
    if (typeof this.onOmniPickerPick == 'function') {
      this.onOmniPickerPick(itemData);
    }
    this.omniPickerReset();
  };

  omniPickerSelect = (idx: number) => {
    this.setState({
      keyUsed: false,
      selected: idx,
    });
  };

  getOmniPickerWrapperProps = () => {
    const { omniPickerOpen } = this.state;
    const { id } = this;
    return {
      id: `omnipicker-${id}-combobox`,
      role: 'combobox',
      'aria-haspopup': 'listbox',
      'aria-expanded': omniPickerOpen,
      style: { position: 'relative' },
    };
  };

  getOmniPickerInputProps = () => {
    const { omniPickerFilterValue, selected } = this.state;
    const { id } = this;
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
      'aria-activedescendant': `omnipicker-${id}-item-${selected}`,
    };
  };

  getOmniPickerDropdownProps = () => {
    const { data, filter, getItem, itemComponent } = this.props;
    const { keyUsed, omniPickerFilterValue, selected } = this.state;
    const filteredData = filter(data, omniPickerFilterValue);
    const { id } = this;
    return {
      getItem,
      id,
      itemComponent,
      inputRef: this.inputNode,
      keyUsed,
      filteredData,
      onChoose: this.omniPickerChoose,
      onClose: this.omniPickerClose,
      onSelect: this.omniPickerSelect,
      selected,
    };
  };

  render() {
    /* Please subclass this component and create your own render function */
    return null;
  }
}

export default OmniPicker;
