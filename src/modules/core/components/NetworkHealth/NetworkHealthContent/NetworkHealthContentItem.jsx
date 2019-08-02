/* @flow */

// $FlowFixMe until hooks flow types
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import type { NetworkHealthItem } from '../types';

import NetworkHealthIcon from '../NetworkHealthIcon';

import styles from './NetworkHealthContentItem.css';

type Props = {|
  networkHealthItem: NetworkHealthItem,
|};

const displayName = 'NetworkHealth.NetworkHealthContentItem';

const NetworkHealthContentItem = ({
  networkHealthItem: { itemTitle, itemTitleValues, itemHealth },
}: Props) => {
  const highlightedItem = useMemo(
    () => {
      if (typeof itemTitle == 'string') {
        return <span>{itemTitle}</span>;
      }
      if (itemTitle && itemTitle.id && itemTitleValues) {
        const highlightedValues = Object.keys(itemTitleValues)
          .map(itemKey =>
            itemTitleValues && itemTitleValues[itemKey]
              ? {
                  [itemKey]: (
                    <span className={styles.itemTitleValuesHighlight}>
                      {itemTitleValues[itemKey]}
                    </span>
                  ),
                }
              : {},
          )
          .reduce(
            (highlightedValuesObject, highlightedValue) =>
              Object.assign(highlightedValuesObject, highlightedValue),
            {},
          );
        return <FormattedMessage {...itemTitle} values={highlightedValues} />;
      }
      return null;
    },
    [itemTitle, itemTitleValues],
  );
  return (
    <li className={styles.main}>
      <span className={styles.healthIconWrapper}>
        <NetworkHealthIcon health={itemHealth} appearance={{ size: 'pea' }} />
      </span>
      {highlightedItem}
    </li>
  );
};

NetworkHealthContentItem.displayName = displayName;

export default NetworkHealthContentItem;
