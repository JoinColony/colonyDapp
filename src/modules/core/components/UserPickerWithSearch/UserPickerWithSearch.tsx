import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import compose from 'recompose/compose';
import classNames from 'classnames';
import { useField } from 'formik';

import { AnyUser } from '~data/index';
import { Address, SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';
import UserAvatar from '~core/UserAvatar';
import { ItemDefault } from '~core/SingleUserPicker';
import withAdditionalOmniPicker from '~core/OmniPicker/withAdditionalOmniPicker';

import { ItemDataType, WrappedComponentAdditionalProps } from '../OmniPicker';
import { Props as WithOmnipickerInProps } from '../OmniPicker/withOmniPicker';
import { InputLabel } from '../Fields';
import Icon from '../Icon';

import Dropdown from './Dropdown';
import { DROPDOWN_HEIGHT, DROPDOWN_ITEM_HEIGHT } from './constants';
import styles from './UserPickerWithSearch.css';

type AvatarRenderFn = (
  address: Address,
  user?: ItemDataType<AnyUser>,
) => ReactNode;

const MSG = defineMessages({
  selectMember: {
    id: 'UserPickerWithSearch.selectMember',
    defaultMessage: 'Select member',
  },
  emptyMessage: {
    id: 'UserPickerWithSearch.emptyMessage',
    defaultMessage: 'No Colony members match that search.',
  },
  remove: {
    id: 'UserPickerWithSearch.remove',
    defaultMessage: 'Remove',
  },
  closedCaret: {
    id: 'UserPickerWithSearch.closedCaret',
    defaultMessage: 'Closed user picker',
  },
  openedCaret: {
    id: 'UserPickerWithSearch.openedCaret',
    defaultMessage: 'Opened user picker',
  },
});

interface Props extends WithOmnipickerInProps {
  /** Renders an extra button to remove selection */
  disabled?: boolean;

  /** Should render the select without a label */
  elementOnly?: boolean;

  /** Help text */
  help?: string | MessageDescriptor;

  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;

  /** Label text */
  label: string | MessageDescriptor;

  /** Label text values for intl interpolation */
  labelValues?: SimpleMessageValues;

  /** Html `name` attribute */
  name: string;

  /** Status text */
  placeholder?: string | MessageDescriptor;

  /** Override avatar rendering */
  renderAvatar: AvatarRenderFn;

  /** Item component for omnipicker listbox */
  renderItem?: (user: ItemDataType<AnyUser>, selected?: boolean) => ReactNode;

  /** Callback for things that happend after selection  */
  onSelected?: (user: AnyUser) => void;

  value?: AnyUser;

  /** Provides value for data-test prop in the input used on cypress testing */
  dataTest?: string;

  /** Provides value for data-test prop in the item list component used on cypress testing */
  itemDataTest?: string;

  /** Provides value for data-test prop in the value of the input used on cypress testing */
  valueDataTest?: string;

  sidebarRef?: HTMLElement | null;
}

interface EnhancedProps extends Props, WrappedComponentAdditionalProps {}

const displayName = 'UserPickerWithSearch';

const UserPickerWithSearch = ({
  disabled,
  elementOnly,
  help,
  helpValues,
  inputProps,
  label,
  labelValues,
  name,
  OmniPicker,
  omniPickerIsOpen,
  OmniPickerWrapper,
  onSelected,
  toggleOmniPicker,
  placeholder,
  registerInputNode,
  renderAvatar = (address: Address, item?: ItemDataType<AnyUser>) => (
    <UserAvatar address={address} user={item} size="xs" />
  ),
  renderItem,
  dataTest,
  itemDataTest,
  valueDataTest,
  registerTriggerNode,
  sidebarRef,
  data,
}: EnhancedProps) => {
  const [, { error, value }, { setValue }] = useField<AnyUser | null>(name);
  const { formatMessage } = useIntl();
  const ref = useRef<HTMLDivElement>(null);
  const omniInputRef = useRef<HTMLInputElement | null>(null);

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      toggleOmniPicker();
    }
  }, [disabled, toggleOmniPicker]);

  const handlePick = useCallback(
    (user: AnyUser) => {
      if (setValue) setValue(user);
      if (onSelected) onSelected(user);
    },
    [onSelected, setValue],
  );

  const defaultRenderItem = useCallback(
    (user: ItemDataType<AnyUser>) => (
      <ItemDefault
        itemData={user}
        renderAvatar={renderAvatar}
        showMaskedAddress
        dataTest={itemDataTest}
      />
    ),
    [renderAvatar, itemDataTest],
  );

  const placeholderText =
    !placeholder || typeof placeholder === 'string'
      ? placeholder
      : formatMessage(placeholder);

  const dropdownHeight = useMemo(() => {
    const height = data.length * DROPDOWN_ITEM_HEIGHT;
    return height > DROPDOWN_HEIGHT ? DROPDOWN_HEIGHT : height;
  }, [data]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const fixAction = () => {
      if (!disabled) {
        toggleDropdown();
        timeout = setTimeout(() => {
          omniInputRef?.current?.focus();
        }, 1);
      }
    };

    // custom event is being used here - which was created specially for elements with additional onFocus logic
    window.addEventListener('fix-trigger', fixAction);

    return () => {
      window.removeEventListener('fix-trigger', fixAction);
      clearTimeout(timeout);
    };
  }, [disabled, toggleDropdown]);

  return (
    <OmniPickerWrapper className={getMainClasses({}, styles)}>
      <div className={styles.container} ref={ref}>
        <InputLabel
          inputId={inputProps.id}
          label={label}
          labelValues={labelValues}
          help={help}
          helpValues={helpValues}
          appearance={{ direction: 'horizontal' }}
          screenReaderOnly={elementOnly}
        />
        <div className={styles.inputWithIcon} ref={registerTriggerNode}>
          <button
            type="button"
            className={styles.inputWithIconBtn}
            aria-invalid={!!error}
            {...(disabled ? {} : { onClick: toggleDropdown })}
            disabled={disabled}
          >
            {value ? (
              renderAvatar(value.profile.walletAddress, value)
            ) : (
              <Icon
                className={classNames(styles.icon, {
                  [styles.focusIcon]: omniPickerIsOpen,
                  [styles.errorIcon]: error,
                })}
                name="circle-person"
                title={MSG.selectMember}
              />
            )}
            {value && (
              <span
                className={classNames(styles.recipientName)}
                data-test={valueDataTest}
              >
                {value.profile.displayName ||
                  value.profile.username ||
                  value.profile.walletAddress}
              </span>
            )}
            <Icon
              className={classNames(styles.arrowIcon, {
                [styles.arrowIconActive]: omniPickerIsOpen,
                [styles.errorIcon]: error,
              })}
              name="caret-down-small"
              title={omniPickerIsOpen ? MSG.openedCaret : MSG.closedCaret}
            />
          </button>
          {omniPickerIsOpen && (
            <Dropdown
              element={ref.current}
              scrollContainer={sidebarRef}
              dropdownHeight={dropdownHeight}
            >
              <div className={styles.omniPickerContainer}>
                <OmniPicker
                  renderItem={renderItem || defaultRenderItem}
                  onPick={handlePick}
                  height="large"
                >
                  <div className={styles.inputWrapper}>
                    <input
                      disabled={disabled}
                      className={styles.input}
                      {...inputProps}
                      placeholder={placeholderText}
                      ref={(inputRef) => {
                        registerInputNode(inputRef);
                        omniInputRef.current = inputRef;
                      }}
                      data-test={dataTest}
                    />
                  </div>
                </OmniPicker>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </OmniPickerWrapper>
  );
};

UserPickerWithSearch.displayName = displayName;

const enhance = compose<EnhancedProps, Props>(withAdditionalOmniPicker());

export default enhance(UserPickerWithSearch);
