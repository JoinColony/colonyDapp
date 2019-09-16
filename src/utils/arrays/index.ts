import difference from 'lodash/difference';

import { Address } from '~types/index';
import {
  ColonyTokenReferenceType,
  UserTokenReferenceType,
} from '~immutable/index';

import { ZERO_ADDRESS } from '../web3/constants';

/**
 * pass in array of strings and shuffle them around
 */

/* eslint-disable-next-line import/prefer-default-export */
export const shuffle = (array: string[]) => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    // eslint-disable-next-line no-param-reassign
    array[currentIndex] = array[randomIndex];
    // eslint-disable-next-line no-param-reassign
    array[randomIndex] = temporaryValue;
  }
  return array;
};

/**
 * Sort an array of objects by multiple properties.
 */
type ValidSortByType = boolean | number | string;

interface SortByPropertyConfig {
  // Name is mandatory, otherwise you could just use the array sort function
  name: string;
  compareFn?: (prevVal: any, nextVal: any) => number;
  reverse?: boolean;
}

export const sortObjectsBy = (
  ...sortByPropertyNames: (string | SortByPropertyConfig)[]
): ((prev: object, next: object) => number) => {
  const defaultCompare = (
    valA: ValidSortByType,
    valB: ValidSortByType,
  ): number => {
    if (!!valA && valB === undefined) {
      return -1;
    }
    if (!!valB && valA === undefined) {
      return 1;
    }

    if (typeof valA !== typeof valB) {
      return 0;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      // eslint-disable-next-line no-param-reassign
      valA = valA.toLowerCase();
      // eslint-disable-next-line no-param-reassign
      valB = valB.toLowerCase();
    }

    if (valA === valB) {
      return 0;
    }

    if (typeof valA === 'boolean' && typeof valB === 'boolean') {
      if (valA || valB) {
        return valA ? -1 : 1;
      }
    }

    return valA < valB ? -1 : 1;
  };

  const sortByConfigs = sortByPropertyNames.map(sortKey =>
    typeof sortKey === 'string' ? { name: sortKey } : sortKey,
  );

  return (prev: object, next: object): number => {
    let result = 0;

    for (let i = 0; i < sortByConfigs.length; i += 1) {
      const {
        name,
        compareFn = defaultCompare,
        reverse = false,
      }: SortByPropertyConfig = sortByConfigs[i];

      const directionMultiplier = reverse ? -1 : 1;
      const prevVal = prev[name];
      const nextVal = next[name];

      result = compareFn(prevVal, nextVal) * directionMultiplier;
      if (result !== 0) {
        break;
      }
    }
    return result;
  };
};

/**
 * Diff two arrays of addresses and return arrays of added and removed items.
 */
export const diffAddresses = (
  a: Address[],
  b: Address[],
): [Address[], Address[]] => [difference(a, b), difference(b, a)];

/**
 * Sort an array of TokenReferences so that any of address `0x0` are first.
 */
export const sortTokensByEth = (
  a: ColonyTokenReferenceType | UserTokenReferenceType,
  b: ColonyTokenReferenceType | UserTokenReferenceType,
) => {
  if (a.address === ZERO_ADDRESS) return -1;
  if (b.address === ZERO_ADDRESS) return 1;
  return 0;
};

/**
 * Nest a an array of object using ids and they're parents ids
 *
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
interface ConsumableItem {
  id: number;
  name: string;
  parent?: number;
  children?: ConsumableItem[];
}
interface CollapsedItem {
  id: number;
  name: string;
  children?: CollapsedItem[];
}
export const recursiveNestChildren = (
  items: ConsumableItem[] = [],
  firstParentLevel = 0,
) => {
  const collapsedItems: CollapsedItem[] = [];
  items.forEach(item => {
    if (!item.parent) {
      /*
       * If the current item doesn't have the `parent` prop, we add it with id 0
       */

      /* eslint-disable-next-line no-param-reassign */
      item.parent = 0;
    }
    if (item.parent === firstParentLevel) {
      const children = recursiveNestChildren(items, item.id);

      /*
       * Add the children prop (which was already costructed recursevly)
       */
      if (children.length) {
        /* eslint-disable-next-line no-param-reassign */
        item.children = children;
      }
      collapsedItems.push(item);
    }
  });
  return collapsedItems;
};

/*
Extracts the required values to be used in the SingleUserPicker
on selection
*/
export const filterUserSelection = (data, filterValue) => {
  if (!filterValue) {
    return data;
  }

  const filtered = data.filter(
    user =>
      user &&
      filterValue &&
      (user.profile.username
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
        user.profile.walletAddress
          .toLowerCase()
          .includes(filterValue.toLowerCase())),
  );

  const customValue = {
    id: 'filterValue',
    profile: {
      walletAddress: filterValue,
      displayName: filterValue,
    },
  };

  return [customValue].concat(filtered);
};
