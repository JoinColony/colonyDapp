import React, {
  Fragment,
  ReactNode,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { useField } from 'formik';

import Button from '~core/Button';
import Popover, { Tooltip } from '~core/Popover';
import { sortObjectsBy, recursiveNestChildren } from '~utils/arrays';

import styles from './ItemsList.css';
import { usePrevious } from '~utils/hooks';

const MSG = defineMessages({
  fallbackListButton: {
    id: 'ItemsList.fallbackListButton',
    defaultMessage: 'Open List',
  },
});

export interface ConsumableItem {
  disabled?: boolean;
  disabledText?: MessageDescriptor | string;
  id: number;
  name: string;
  parent?: number;
  children?: ConsumableItem[];
}

interface Props {
  /** Children to render and to use as a trigger for the Popover */
  children?: ReactNode;

  /** Whether the selector should be disabled */
  disabled?: boolean;

  /** Prefix to display before the individual item when rendering it */
  itemDisplayPrefix?: string;

  /** Suffix to display after the individual item when rendering it */
  itemDisplaySuffix?: string;

  /** The intial list of items to display (before collapsing it) */
  list: ConsumableItem[];

  /** Field name */
  name: string;

  /** Whether the value can be unset */
  nullable?: boolean;

  /** Callback function, called after the field value has been set */
  onChange?: (value: number | null | undefined) => void;

  /** Wheather or not to show the Popover's arrow */
  showArrow?: boolean;
}

const displayName = 'ItemsList';

const ItemsList = ({
  children,
  disabled,
  itemDisplayPrefix = '',
  itemDisplaySuffix = '',
  list,
  name: fieldName,
  onChange: onChangeCallback,
  nullable,
  showArrow = true,
}: Props) => {
  const [, { initialValue, value }, { setValue }] = useField<
    number | null | undefined
  >(fieldName);
  // This values determines if any item in the (newly opened) list was selected
  const [listTouched, setListTouched] = useState<boolean>(false);
  // Item selected in the popover list
  const [selectedItem, setSelectedItem] = useState<number | null>();

  const previousValue = usePrevious<number | null | undefined>(value);

  /*
   * Handle resetting state on popover close
   */
  const handleCleanup = (cleanupCallback?: () => void) => {
    if (selectedItem !== value && listTouched) {
      setSelectedItem(value);
      setListTouched(false);
    }
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
      const { id: currentItemId } =
        list.find(({ id }) => id === selectedItem) || {};
      setListTouched(false);
      setValue(currentItemId);
      close();
      if (onChangeCallback) {
        onChangeCallback(value);
      }
    },
    [list, onChangeCallback, selectedItem, setValue, value],
  );

  /*
   * Unset the item when clicking the `remove` button
   */
  const handleUnset = useCallback(
    (close: () => void) => {
      setSelectedItem(undefined);
      setListTouched(false);
      setValue(null);
      close();
      if (onChangeCallback) {
        onChangeCallback(value);
      }
    },
    [onChangeCallback, setValue, value],
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
    if (value !== previousValue) {
      setSelectedItem(value);
    }
  }, [previousValue, value]);

  useEffect(() => {
    if (initialValue) {
      setSelectedItem(initialValue);
    }
  }, [initialValue]);

  const collapsedList = useMemo(
    () => recursiveNestChildren(list.sort(sortObjectsBy('name'))),
    [list],
  );

  const currentItemElement = useMemo(
    () => list.find(({ id }) => id === value),
    [value, list],
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

export default ItemsList;
