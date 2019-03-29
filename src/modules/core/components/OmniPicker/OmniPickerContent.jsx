/* @flow */

import React from 'react';

import styles from './OmniPickerContent.css';

import type {
  Choose,
  EmptyRenderFnType,
  ItemRenderFnType,
  Select,
} from './types';

import OmniPickerItem from './OmniPickerItem.jsx';

type Props = {|
  filteredData?: Array<{ id: string }>,
  id: string,
  renderEmpty: EmptyRenderFnType,
  renderItem: ItemRenderFnType<*>,
  keyUsed: boolean,
  selected: number,
  onChoose: Choose,
  onSelect: Select,
|};

// The key events are handled by the OmniPickerBase class
/* eslint-disable jsx-a11y/click-events-have-key-events */
const OmniPickerContent = ({
  onChoose,
  filteredData = [],
  id,
  renderEmpty,
  renderItem,
  keyUsed,
  onSelect,
  selected,
}: Props) => (
  <div className={styles.main}>
    <ul onClick={onChoose} role="listbox" id={`omnipicker-${id}-listbox`}>
      {filteredData.length
        ? filteredData.map((itemData, idx) => (
          /* eslint-disable prettier/prettier */
          <OmniPickerItem
            key={itemData.id}
            idx={idx}
            keyUsed={keyUsed}
            selected={selected === idx}
            itemData={itemData}
            onSelect={onSelect}
            renderItem={renderItem}
          />))
        : renderEmpty()
        /* eslint-enable prettier/prettier */
      }
    </ul>
  </div>
);

OmniPickerContent.displayName = 'OmniPicker.OmniPickerContent';

export default OmniPickerContent;
