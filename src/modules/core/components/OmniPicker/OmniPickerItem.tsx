import React, { Component } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

import { ItemDataType, ItemRenderFnType } from './types';

interface Props {
  keyUsed?: boolean;
  idx: number;
  selected: boolean;
  itemData: ItemDataType<any>;
  onSelect: (idx: number) => void;
  renderItem: ItemRenderFnType<any>;
}

class OmniPickerItem extends Component<Props> {
  static displayName = 'OmniPicker.OmniPickerItem';

  select = () => {
    const { idx, onSelect } = this.props;
    onSelect(idx);
  };

  scrollToElement = (elm: HTMLElement | null) => {
    const { selected, keyUsed } = this.props;
    if (!elm || !selected || !keyUsed) {
      return;
    }
    scrollIntoView(elm, { behavior: 'smooth', scrollMode: 'if-needed' });
  };

  render() {
    const { idx, selected, itemData, renderItem } = this.props;
    return (
      <li
        id={`omnipicker-item-${idx}`}
        role="option"
        aria-selected={selected}
        onMouseEnter={this.select}
        ref={ref => this.scrollToElement(ref)}
      >
        {renderItem(itemData, selected)}
      </li>
    );
  }
}

export default OmniPickerItem;
