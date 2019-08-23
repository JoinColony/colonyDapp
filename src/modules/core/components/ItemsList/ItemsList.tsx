import { MessageDescriptor, MessageValues, defineMessages } from 'react-intl';
import React, { Component, Fragment, ReactNode } from 'react';

import { ConsumableItem } from './index';
import { asField } from '~core/Fields';
import Button from '~core/Button';
import Popover from '~core/Popover';
import styles from './ItemsList.css';

const MSG = defineMessages({
  fallbackListButton: {
    id: 'ItemsList.fallbackListButton',
    defaultMessage: 'Open List',
  },
});

interface Props {
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean;

  /** Input field name (form variable) */
  name: string;

  /** The already nested list, generated from list by the wrapper */
  collapsedList: ConsumableItem[];

  /** Wheather or not to show the Popover's arrow */
  showArrow?: boolean;

  /** The intial list of items to display (before collapsing it) */
  list: ConsumableItem[];

  /** Children to render and to use as a trigger for the Popover */
  children?: ReactNode;

  /** Prefix to display before the individual item when rendering it */
  itemDisplayPrefix?: string;

  /** Suffix to display after the individual item when rendering it */
  itemDisplaySuffix?: string;

  /** Callback to call when setting a new item (only when the Form isn't connected) */
  handleSetItem?: (value?: ConsumableItem) => void;

  /** The item ID given to the form as the current ID */
  itemId: number | void;

  /** Whether the selector should be disabled */
  disabled?: boolean;

  /** Whether the value can be unset */
  nullable?: boolean;

  /** @ignore Will be injected by `asField` */
  $id: string;

  /** @ignore Will be injected by `asField` */
  $error?: string;

  /** @ignore Will be injected by `asField` */
  $value?: string;

  /** @ignore Will be injected by `asField` */
  $touched?: boolean;

  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: MessageValues,
  ) => string;

  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void;

  /** @ignore Will be injected by `asField` */
  setError: (val: any) => void;
}

type State = {
  /*
   * This values determines if any item in the (newly opened) list was selected
   */
  listTouched: boolean;

  /*
   * Item selected in the popover list
   */
  selectedItem: number | void;

  /*
   * Item that is actually set on the task
   */
  setItem: number | void;
};

class ItemsList extends Component<Props, State> {
  static displayName = 'ItemsList';

  state = {
    listTouched: false,
    setItem: undefined,
    selectedItem: undefined,
  };

  /*
   * Handle clicking on each individual item in the list
   */
  handleSelectItem = (id: number) => {
    /*
     * Prevent selecting a negative index items
     */
    if (id >= 0) {
      this.setState({ selectedItem: id, listTouched: true });
    }
  };

  /*
   * Handle cleanup when closing the popover (or pressing cancel)
   *
   * If an item was selected, but not set (didn't submit the form) then we
   * need to re-set it back to the original set item.
   *
   * Otherwise the next time it will open it will show the selected one, and not
   * the actual set one.
   */
  handleCleanup = (callback?: () => void): void => {
    const { setItem } = this.state || undefined;
    this.setState({ selectedItem: setItem, listTouched: false }, callback);
  };

  /*
   * Set the item when clicking the confirm button
   */
  handleSet = (close: () => void) => {
    const {
      state: { selectedItem: selectedItemId },
      props: {
        handleSetItem: callback = (value: ConsumableItem) => value,
        list = [],
        connect,
        setValue,
      },
    } = this;
    const { id: itemId = undefined, name = undefined } =
      list.find(({ id }) => id === selectedItemId) || {};

    /*
     * Prevent setting a negative index items
     */
    if (selectedItemId && selectedItemId >= 0) {
      this.setState(
        {
          setItem: selectedItemId,
          selectedItem: undefined,
          listTouched: false,
        },
        () => {
          close();

          /*
           * @NOTE If we don't deconstruct here and filter the values passed down,
           * the nested values will also be passed down
           */
          if (!connect) {
            return callback({ id: itemId, name });
          }
          return setValue(selectedItemId);
        },
      );
    }
  };

  /*
   * Set the item when clicking the confirm button
   */
  handleUnset = (close: () => void) => {
    const {
      props: {
        handleSetItem: callback = (value?: ConsumableItem) => value,
        connect,
        setValue,
      },
    } = this;
    this.setState(
      {
        setItem: undefined,
        selectedItem: undefined,
        listTouched: false,
      },
      () => {
        close();
        if (!connect) {
          return callback();
        }
        return setValue(null);
      },
    );
  };

  /*
   * Helper to render an entry in the items list
   *
   * @NOTE This will recursevly render nested children
   */
  renderListItem = (
    { id, name, children }: ConsumableItem,
    nestingCounter = 0,
  ) => {
    const { selectedItem } = this.state;
    const { itemDisplayPrefix = '', itemDisplaySuffix = '' } = this.props;
    /*
     * Add prefix/suffix
     */
    const decoratedName = `${itemDisplayPrefix}${name}${itemDisplaySuffix}`;
    /*
     * Recursevly render nested children
     */
    const recursiveChildRender = () => {
      if (children && children.length) {
        return children.map((item: ConsumableItem) =>
          this.renderListItem(item, nestingCounter + 1),
        );
      }
      return null;
    };
    return (
      <Fragment key={id}>
        <li
          className={selectedItem === id ? styles.selectedItem : null}
          style={{
            paddingLeft: `${nestingCounter *
              parseInt(styles.paddingValue, 10)}px`,
          }}
        >
          <button
            type="button"
            className={id < 0 ? styles.itemHeading : styles.item}
            onClick={() => this.handleSelectItem(id)}
            title={decoratedName}
          >
            {decoratedName}
          </button>
        </li>
        {recursiveChildRender()}
      </Fragment>
    );
  };

  render() {
    const {
      state: { setItem: setItemId, listTouched },
      props: {
        showArrow = true,
        list = [],
        collapsedList = [],
        children,
        itemDisplayPrefix = '',
        itemDisplaySuffix = '',
        itemId,
        disabled,
        nullable,
      },
      handleSet,
      handleUnset,
      renderListItem,
    } = this;
    const currentItem: ConsumableItem | void = list.find(
      ({ id }) => id === (setItemId || itemId),
    );

    return (
      <div className={styles.main}>
        <Popover
          trigger={disabled ? 'disabled' : 'click'}
          placement="bottom"
          onClose={this.handleCleanup}
          showArrow={showArrow}
          content={({ close }) => (
            <div className={styles.itemsWrapper}>
              <ul className={styles.itemList}>
                {collapsedList.map((item: ConsumableItem) =>
                  renderListItem(item),
                )}
              </ul>
              <div className={styles.controls}>
                <Button
                  appearance={{ theme: 'secondary' }}
                  text={{ id: 'button.cancel' }}
                  onClick={() => this.handleCleanup(close)}
                />
                {nullable && (
                  <Button
                    appearance={{ theme: 'danger' }}
                    text={{ id: 'button.remove' }}
                    disabled={!currentItem}
                    onClick={() => handleUnset(close)}
                  />
                )}
                <Button
                  appearance={{ theme: 'primary' }}
                  text={{ id: 'button.confirm' }}
                  disabled={!listTouched}
                  onClick={() => handleSet(close)}
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
              appearance={{ theme: 'primary' }}
              text={MSG.fallbackListButton}
            />
          )}
        </Popover>
        {/*
         * TODO This should be passed _somehow_ outside of this component, so
         * that displaying it has a bigger degree of customization.
         * (Consumers maybe?)
         */}
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

export default (asField({
  initialValue: '',
}) as any)(ItemsList);
