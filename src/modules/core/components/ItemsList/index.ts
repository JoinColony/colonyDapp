import { ComponentType, ReactNode } from 'react';
import { compose, withProps } from 'recompose';
import { MessageDescriptor } from 'react-intl';

import { sortObjectsBy, recursiveNestChildren } from '~utils/arrays';

import ItemsList from './ItemsList';

export interface ConsumableItem {
  disabled?: boolean;
  disabledText?: MessageDescriptor | string;
  id: number;
  name: string;
  parent?: number;
  children?: ConsumableItem[];
}

interface PartialProps {
  list: ConsumableItem[];
  itemDisplayPrefix?: string;
  itemDisplaySuffix?: string;
  children?: ReactNode;

  /*
   * Everything below is injected by `asField`
   */
  appearance?: object;
  $error?: string;
  $value?: string;
  $touched?: boolean;
  label?: MessageDescriptor | string;
  name: string;
  placeholder?: MessageDescriptor | string;
  title?: MessageDescriptor | string;
  handleSetItem?: any;
  connect?: any;
  showArrow?: boolean;
  itemId?: number;
  disabled?: boolean;
  nullable?: boolean;
}

// Ensure mapped IDs are unique in #1041
const enhance = compose(
  withProps(
    ({ list = [], itemDisplayPrefix, itemDisplaySuffix }: PartialProps) => ({
      collapsedList: recursiveNestChildren(list.sort(sortObjectsBy('name'))),
      itemDisplayPrefix,
      itemDisplaySuffix,
    }),
  ),
);

export default enhance(ItemsList) as ComponentType<PartialProps>;
