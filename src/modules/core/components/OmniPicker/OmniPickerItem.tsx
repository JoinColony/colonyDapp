import React, { useCallback } from 'react';
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

const displayName = 'OmniPicker.OmniPickerItem';

const OmniPickerItem = ({
  idx,
  keyUsed,
  onSelect,
  selected,
  itemData,
  renderItem,
}: Props) => {
  const select = useCallback(() => {
    onSelect(idx);
  }, [idx, onSelect]);

  const scrollToElement = useCallback(
    (elm: HTMLElement | null) => {
      if (!elm || !selected || !keyUsed) {
        return;
      }
      scrollIntoView(elm, { behavior: 'smooth', scrollMode: 'if-needed' });
    },
    [keyUsed, selected],
  );

  return (
    <li
      id={`omnipicker-item-${idx}`}
      role="option"
      aria-selected={selected}
      onMouseEnter={select}
      ref={scrollToElement}
    >
      {renderItem(itemData, selected)}
    </li>
  );
};

OmniPickerItem.displayName = displayName;

export default OmniPickerItem;
