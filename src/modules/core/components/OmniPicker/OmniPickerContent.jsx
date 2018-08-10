/* @flow */

import type { ComponentType } from 'react';

import React from 'react';

import styles from './OmniPickerContent.css';

import type { Choose, ItemComponentType, Select } from './types';

import OmniPickerItem from './OmniPickerItem.jsx';

type Props = {
  filteredData?: Array<{ id: string }>,
  id: string,
  itemComponent: ItemComponentType,
  emptyComponent: ComponentType<{}>,
  keyUsed?: boolean,
  selected: number,
  choose: Choose,
  select: Select,
};

// The key events are handled by the OmniPickerBase class
/* eslint-disable jsx-a11y/click-events-have-key-events */
const OmniPickerContent = ({
  choose,
  filteredData = [],
  id,
  itemComponent,
  emptyComponent: EmptyComponent,
  keyUsed,
  select,
  selected,
}: Props) => (
  <div className={styles.main}>
    <ul onClick={choose} role="listbox" id={`omnipicker-${id}-listbox`}>
      {filteredData.length ? (
        filteredData.map((itemData, idx) => (
          <OmniPickerItem
            key={itemData.id}
            idx={idx}
            keyUsed={keyUsed}
            selected={selected === idx}
            itemData={itemData}
            onSelect={select}
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
