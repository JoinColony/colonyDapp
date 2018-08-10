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

  render() {
    const {
      idx,
      keyUsed,
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
        ref={elm =>
          selected &&
          keyUsed &&
          elm &&
          elm.scrollIntoView &&
          elm.scrollIntoView()
        }
      >
        <ItemComponent itemData={itemData} selected={selected} />
      </li>
    );
  }
}

export default OmniPickerItem;
