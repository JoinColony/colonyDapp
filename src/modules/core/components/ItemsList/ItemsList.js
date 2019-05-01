/* @flow */

import type { HOC } from 'recompose';
import type { MessageDescriptor } from 'react-intl';

import { compose, withProps } from 'recompose';

import { sortObjectsBy, recursiveNestChildren } from '~utils/arrays';

import ItemsList from './ItemsList.jsx';

export type ConsumableItem = {
  id: number,
  name: string,
  parent?: number,
  children?: Array<ConsumableItem>,
};

type PartialProps = {
  list: Array<ConsumableItem>,
  itemDisplayPrefix?: string,
  itemDisplaySuffix?: string,
  /*
   * @NOTE Everything below is injected by `asField`
   */
  appearance?: Object,
  $error?: string,
  $value?: string,
  $touched?: boolean,
  label?: MessageDescriptor | string,
  name: string,
  placeholder?: MessageDescriptor | string,
  title?: MessageDescriptor | string,
};

// Ensure mapped IDs are unique in #1041
const enhance: HOC<*, PartialProps> = compose(
  withProps(
    ({ list = [], itemDisplayPrefix, itemDisplaySuffix }: PartialProps) => ({
      collapsedList: recursiveNestChildren(list.sort(sortObjectsBy('name'))),
      itemDisplayPrefix,
      itemDisplaySuffix,
    }),
  ),
);

export default enhance(ItemsList);
