/* @flow */

import React, { Component } from 'react';

import type { ItemComponentType } from './types';

type Props = {
  keyUsed?: boolean,
  idx: number,
  selected: boolean,
  itemData: { id: string },
  onSelect: (idx: number) => void,
  itemComponent: ItemComponentType,
};

class OmniPickerItem extends Component<Props> {
  static displayName = 'OmniPicker.OmniPickerItem';

  select = () => {
    const { idx, onSelect } = this.props;
    onSelect(idx);
  };

  scrollToElement = (elm: ?HTMLElement) => {
    const { selected, keyUsed } = this.props;
    if (!elm || !selected || !keyUsed) {
      return;
    }
    // $FlowFixMe Yeah, I know, but sometimes it IS there!
    if (typeof elm.scrollIntoViewIfNeeded == 'function') {
      elm.scrollIntoViewIfNeeded();
    } else if (typeof elm.scrollIntoView == 'function') {
      elm.scrollIntoView();
    }
  };

  render() {
    const {
      idx,
      selected,
      itemData,
      itemComponent: ItemComponent,
    } = this.props;
    return (
      <li
        id={`omnipicker-item-${idx}`}
        role="option"
        aria-selected={selected}
        onMouseEnter={this.select}
        ref={ref => this.scrollToElement(ref)}
      >
        <ItemComponent itemData={itemData} selected={selected} />
      </li>
    );
  }
}

export default OmniPickerItem;
