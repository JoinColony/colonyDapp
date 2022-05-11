/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import classNames from 'classnames';

import { Choose, EmptyRenderFnType, ItemRenderFnType, Select } from './types';
import OmniPickerItem from './OmniPickerItem';
import styles from './OmniPickerContent.css';

interface Props {
  filteredData?: { id: string }[];
  id: string;
  renderEmpty: EmptyRenderFnType;
  renderItem: ItemRenderFnType<any>;
  keyUsed: boolean;
  selected: number;
  onChoose: Choose;
  onSelect: Select;
  height?: 'small' | 'large';
  children: React.ReactNode;
}

// The key events are handled by the OmniPickerBase class
const OmniPickerContent = ({
  onChoose,
  filteredData = [],
  id,
  renderEmpty,
  renderItem,
  keyUsed,
  onSelect,
  selected,
  height,
  children,
}: Props) => (
  <div
    className={classNames(
      styles.main,
      height === 'large' && styles.largeHeight,
    )}
  >
    {children}
    <ul onClick={onChoose} role="listbox" id={`omnipicker-${id}-listbox`}>
      {filteredData.length
        ? filteredData.map((itemData, idx) => (
            <OmniPickerItem
              key={itemData.id}
              idx={idx}
              keyUsed={keyUsed}
              selected={selected === idx}
              itemData={itemData}
              onSelect={onSelect}
              renderItem={renderItem}
            />
          ))
        : renderEmpty()}
    </ul>
  </div>
);

OmniPickerContent.displayName = 'OmniPicker.OmniPickerContent';

export default OmniPickerContent;
