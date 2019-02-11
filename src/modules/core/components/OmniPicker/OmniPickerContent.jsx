/* @flow */

import type { ComponentType } from 'react';
import type { List as ListType } from 'immutable';

import React from 'react';
import { List } from 'immutable';

import styles from './OmniPickerContent.css';

import type { Choose, ItemComponentType, Select } from './types';

import OmniPickerItem from './OmniPickerItem.jsx';

// TODO sealing this object shows `className` being used
type Props = {
  filteredData?: ListType<{ id: string }>,
  id: string,
  itemComponent: ItemComponentType,
  emptyComponent: ComponentType<{}>,
  keyUsed: boolean,
  selected: number,
  onChoose: Choose,
  onSelect: Select,
};

// The key events are handled by the OmniPickerBase class
/* eslint-disable jsx-a11y/click-events-have-key-events */
const OmniPickerContent = ({
  onChoose,
  filteredData = List(),
  id,
  itemComponent,
  emptyComponent: EmptyComponent,
  keyUsed,
  onSelect,
  selected,
}: Props) => (
  <div className={styles.main}>
    <ul onClick={onChoose} role="listbox" id={`omnipicker-${id}-listbox`}>
      {filteredData.size ? (
        filteredData.map((itemData, idx) => (
          <OmniPickerItem
            key={itemData.id}
            idx={idx}
            keyUsed={keyUsed}
            selected={selected === idx}
            itemData={itemData}
            onSelect={onSelect}
            itemComponent={itemComponent}
          />
        ))
      ) : (
        <EmptyComponent />
      )}
    </ul>
  </div>
);

OmniPickerContent.displayName = 'OmniPicker.OmniPickerContent';

export default OmniPickerContent;
