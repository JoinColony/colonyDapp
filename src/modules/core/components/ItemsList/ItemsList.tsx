import React, {
  Fragment,
  ReactNode,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { asField } from '~core/Fields';
import { FieldEnhancedProps } from '~core/Fields/types';
import Popover, { Tooltip } from '~core/Popover';

import { ConsumableItem } from './index';

import styles from './ItemsList.css';

const MSG = defineMessages({
  fallbackListButton: {
    id: 'ItemsList.fallbackListButton',
    defaultMessage: 'Open List',
  },
});

interface Props {
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

  /** Callback to call when removing an item (only when the Form isn't connected) */
  handleRemoveItem?: (value?: ConsumableItem) => void;

  /** The item ID given to the form as the current ID */
  itemId: number | void;

  /** Whether the selector should be disabled */
  disabled?: boolean;

  /** Whether the value can be unset */
  nullable?: boolean;
}

const displayName = 'ItemsList';

const ItemsList = ({
  showArrow = true,
  list = [],
  collapsedList = [],
  children,
  itemDisplayPrefix = '',
  itemDisplaySuffix = '',
  itemId,
  disabled,
  nullable,
  handleRemoveItem = (value: ConsumableItem) => value,
  handleSetItem: callback = (value: ConsumableItem) => value,
  connect,
  setValue,
}: Props & FieldEnhancedProps) => {
  // Item that is actually set on the task
  const [currentItem, setCurrentItem] = useState<number | undefined>();
  // This values determines if any item in the (newly opened) list was selected
  const [listTouched, setListTouched] = useState<boolean>(false);
  // Item selected in the popover list
  const [selectedItem, setSelectedItem] = useState<number | undefined>();
  // Whether or not the component needs value cleanup (after close)
  const [needsCleanup, setNeedsCleanup] = useState<boolean>(false);

  /*
   * Handle resetting state on popover close
   */
  const handleCleanup = (cleanupCallback?: () => void) => {
    setNeedsCleanup(true);
    if (cleanupCallback) {
      cleanupCallback();
    }
  };

  /*
   * Handle clicking on each individual item in the list
   */
  const handleSelectItem = (id: number) => {
    if (id >= 0) {
      setSelectedItem(id);
      setListTouched(true);
    }
  };

  /*
   * Set the item when clicking the `confirm` button
   */
  const handleSet = useCallback(
    (close: () => void) => {
      const { id: currentItemId, name } =
        list.find(({ id }) => id === selectedItem) || {};
      setCurrentItem(currentItemId);
      setListTouched(false);
      close();
      if (!connect && currentItemId && name) {
        return callback({ id: currentItemId, name });
      }
      if (setValue) {
        return setValue(currentItemId);
      }
      return null;
    },
    [callback, connect, list, selectedItem, setValue],
  );

  /*
   * Unset the item when clicking the `remove` button
   */
  const handleUnset = useCallback(
    (close: () => void) => {
      setCurrentItem(undefined);
      setSelectedItem(undefined);
      setListTouched(false);
      close();
      if (!connect && handleRemoveItem && itemId) {
        return handleRemoveItem({ id: itemId, name: '' });
      }
      if (setValue) {
        return setValue(null);
      }
      return null;
    },
    [connect, handleRemoveItem, itemId, setValue],
  );

  /*
   * Helper to render an entry in the items list
   *
   * @NOTE This will recursevly render nested children
   */
  const renderListItem = useCallback(
    (
      {
        disabled: itemDisabled,
        disabledText,
        id,
        name,
        children: itemChildren,
      }: ConsumableItem,
      nestingCounter = 0,
    ) => {
      /*
       * Add prefix/suffix
       */
      const decoratedName = `${itemDisplayPrefix}${name}${itemDisplaySuffix}`;
      /*
       * Recursevly render nested children
       */
      const recursiveChildRender = () => {
        if (itemChildren && itemChildren.length) {
          return itemChildren.map((item: ConsumableItem) =>
            renderListItem(item, nestingCounter + 1),
          );
        }
        return null;
      };

      let tooltipContent;
      if (disabledText) {
        tooltipContent =
          typeof disabledText === 'string' ? (
            <>{disabledText}</>
          ) : (
            <FormattedMessage {...disabledText} />
          );
      }

      return (
        <Fragment key={id}>
          <li
            className={selectedItem === id ? styles.selectedItem : undefined}
            style={{
              paddingLeft: `${
                nestingCounter * parseInt(styles.paddingValue, 10)
              }px`,
            }}
          >
            <Tooltip content={tooltipContent} placement="bottom-start">
              {/*
               * Must use a `div` here, as `mouseleave` event isn't fired on buttons that are `disabled`.
               * See: https://github.com/facebook/react/issues/4251
               */}
              <div>
                <button
                  disabled={itemDisabled}
                  type="button"
                  className={id < 0 ? styles.itemHeading : styles.item}
                  onClick={() => handleSelectItem(id)}
                  title={itemDisabled ? undefined : decoratedName}
                >
                  {decoratedName}
                </button>
              </div>
            </Tooltip>
          </li>
          {recursiveChildRender()}
        </Fragment>
      );
    },
    [itemDisplayPrefix, itemDisplaySuffix, selectedItem],
  );

  useEffect(() => {
    if (needsCleanup) {
      if (selectedItem !== currentItem && listTouched) {
        setSelectedItem(currentItem);
        setListTouched(false);
      }
      setNeedsCleanup(false);
    }
  }, [currentItem, listTouched, needsCleanup, selectedItem]);

  const currentItemElement = useMemo(
    () => list.find(({ id }) => id === currentItem || itemId),
    [currentItem, itemId, list],
  );

  return (
    <div className={styles.main}>
      <Popover
        trigger={disabled ? 'disabled' : 'click'}
        placement="bottom"
        onClose={handleCleanup}
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
                onClick={() => handleCleanup(close)}
              />
              {nullable && (
                <Button
                  appearance={{ theme: 'danger' }}
                  text={{ id: 'button.remove' }}
                  disabled={!currentItemElement}
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
          currentItemElement
            ? `${itemDisplayPrefix}${currentItemElement.name}${itemDisplaySuffix}`
            : undefined
        }
      >
        {!!currentItemElement &&
          `${itemDisplayPrefix}${currentItemElement.name}${itemDisplaySuffix}`}
      </div>
    </div>
  );
};

ItemsList.displayName = displayName;

export default asField<Props>({
  initialValue: '',
})(ItemsList);
