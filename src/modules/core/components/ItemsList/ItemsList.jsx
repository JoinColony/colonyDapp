/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import nanoid from 'nanoid';

import Button from '~core/Button';
import Popover from '~core/Popover';

import styles from './ItemsList.css';

const MSG = defineMessages({
  fallbackListButton: {
    id: 'dashboard.TaskDomains.fallbackListButton',
    defaultMessage: 'Open List',
  },
});

/*
 * Eslint is bugging out confusing this type declaration with the actual Prop,
 * and claiming we're not using it.
 */
/* eslint-disable react/no-unused-prop-types */
type ConsumableItem = {
  id: number,
  name: string,
};
/* eslint-enable react/no-unused-prop-types */

type Props = {
  handleSubmit: (...any) => void,
  itemsList: Array<ConsumableItem>,
  children?: React$Element<*>,
  itemDisplayPrefix?: string,
  itemDisplaySuffix?: string,
};

type State = {
  /*
   * This values determines if any domain in the (newly opened) list was selected
   */
  listTouched: boolean,
  /*
   * Domain selected in the popover list
   */
  selectedItem: number | void,
  /*
   * Domain that is actually set on the task
   */
  setItem: number | void,
};

class ItemsList extends Component<Props, State> {
  static displayName = 'dashboard.TaskDomains';

  state = {
    listTouched: false,
    selectedItem: undefined,
    setItem: undefined,
  };

  /*
   * Handle clicking on each individual domain in the list
   */
  handleSelectItem = (id: number) => {
    this.setState({ selectedItem: id, listTouched: true });
  };

  /*
   * Handle cleanup when closing the popover (or pressing cancel)
   *
   * If a domain was selected, but not set (didn't submit the form) then we
   * need to re-set it back to the original set domain.
   *
   * Otherwise the next time it will open it will show the selected one, and not
   * the actual set one.
   */
  handleCleanup = (callback?: () => void): void => {
    const { setItem } = this.state || undefined;
    this.setState({ selectedItem: setItem, listTouched: false }, callback);
  };

  /*
   * Helper to render an entry in the domains list
   */
  renderListItem = ({ id, name }: ConsumableItem) => {
    const { selectedItem } = this.state;
    return (
      <li
        className={selectedItem === id ? styles.selectedItem : null}
        key={nanoid(id)}
      >
        <button
          type="button"
          className={styles.item}
          onClick={() => this.handleSelectItem(id)}
          title={name}
        >
          {`#${name}`}
        </button>
      </li>
    );
  };

  render() {
    const {
      state: { setItem: setItemId, listTouched },
      props: {
        handleSubmit: handleManualSubmit,
        itemsList = [],
        children,
        itemDisplayPrefix = '',
        itemDisplaySuffix = '',
      },
      renderListItem,
    } = this;
    const currentItem: ConsumableItem | void = itemsList.find(
      ({ id }) => id === setItemId,
    );
    return (
      <div className={styles.main}>
        <Popover
          trigger="click"
          placement="bottom"
          onClose={this.handleCleanup}
          content={({ close }) => (
            <div className={styles.itemsWrapper}>
              <ul className={styles.itemList}>
                {itemsList.map((item: ConsumableItem) => renderListItem(item))}
              </ul>
              <div className={styles.controls}>
                <Button
                  appearance={{ theme: 'secondary' }}
                  text={{ id: 'button.cancel' }}
                  onClick={() => this.handleCleanup(close)}
                />
                <Button
                  appearance={{ theme: 'primary' }}
                  text={{ id: 'button.confirm' }}
                  disabled={!listTouched}
                  onClick={() => handleManualSubmit(close)}
                />
              </div>
            </div>
          )}
        >
          {children || (
            /*
             * @NOTE In case there wasn't a child passed in, we render a
             * fallback button
             */
            <Button
              appearance={{ size: 'small' }}
              text={MSG.fallbackListButton}
            />
          )}
        </Popover>
        <div
          className={styles.selectedItemDisplay}
          title={
            currentItem &&
            `${itemDisplayPrefix}${currentItem.name}${itemDisplaySuffix}`
          }
        >
          {currentItem &&
            `${itemDisplayPrefix}${currentItem.name}${itemDisplaySuffix}`}
        </div>
      </div>
    );
  }
}

export default ItemsList;
