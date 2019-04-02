/* @flow */

import type { HOC } from 'recompose';
import type { MessageDescriptor } from 'react-intl';

import { compose, withProps } from 'recompose';

import { sortObjectsBy } from '~utils/arrays';

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

// TODO ensure mapped IDs are unique in #1041
const enhance: HOC<*, PartialProps> = compose(
  withProps(
    ({ list = [], itemDisplayPrefix, itemDisplaySuffix }: PartialProps) => {
      /*
       * @NOTE The parent must be always be declared (have a lower id) than the child
       * While normal logic would imply this, you might run into issues, so take care.
       *
       * As for what this list does, is to take an array of `ConsumableItem` object
       * and create a structure of nested ones.
       *
       * Eg:
       * [
       *   { id: 1 },
       *   { id: 2, parent: 1 },
       *   { id: 3, parent: 2 }
       * ]
       *
       * Is going to be transformed into:
       * [
       *   {
       *     id: 1,
       *     children: [
       *       {
       *         id: 2,
       *         children: [
       *           {
       *             id: 3,
       *           },
       *         ],
       *       },
       *     ],
       *   },
       * ]
       */
      let collapsedList: Array<Object> = list
        .slice()
        .sort(sortObjectsBy('name'));
      /*
       * Construct a list of items to remove (after they were nested)
       */
      const listToClear: Array<number> = [];
      /*
       * Iterate trough children and gather they're ids into the parent
       */
      collapsedList.forEach(item => {
        /*
         * Check if we have a parent it, meaning we're not a top-level item
         */
        if (item.parent) {
          const parentIndex = collapsedList.findIndex(
            ({ id }) => id === item.parent,
          );
          /*
           * Subsequent children in the array
           */
          if (collapsedList[parentIndex].children) {
            collapsedList[parentIndex].children.push(item);
          } else {
            /*
             * First child in the array
             */
            collapsedList[parentIndex].children = [item];
          }
          listToClear.push(item.id);
        }
        /*
         * Have anoter pass and check for children nesting
         */
        if (item.children) {
          item.children.forEach((child, index) => {
            /*
             * Add a new child to the nested list
             */
            /* eslint-disable-next-line no-param-reassign */
            item.children[index] = child;
            /*
             * The child was nested, so we push it's id to the items to clear list
             */
            listToClear.push(child.id);
            return false;
          });
        }
        return false;
      });
      /*
       * Use the previously constructed list to cleanup the final result
       */
      collapsedList = collapsedList.filter(
        ({ id }) => id !== listToClear.find(idToClear => idToClear === id),
      );
      return {
        collapsedList,
        itemDisplayPrefix,
        itemDisplaySuffix,
      };
    },
  ),
);

export default enhance(ItemsList);
