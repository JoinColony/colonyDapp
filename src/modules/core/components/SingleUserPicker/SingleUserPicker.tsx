import React, { ReactNode, useCallback } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import compose from 'recompose/compose';
import classnames from 'classnames';

import { useField } from 'formik';
import { AnyUser } from '~data/index';
import { Address, SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import MaskedAddress from '../MaskedAddress';
import {
  ItemDataType,
  withOmniPicker,
  WrappedComponentProps,
} from '../OmniPicker';
import { Props as WithOmnipickerInProps } from '../OmniPicker/withOmniPicker';
import { InputLabel } from '../Fields';
import Icon from '../Icon';
import Button from '../Button';
import UserAvatar from '~core/UserAvatar';
import ItemDefault from './ItemDefault';

import styles from './SingleUserPicker.css';

type AvatarRenderFn = (
  address: Address,
  user?: ItemDataType<AnyUser>,
) => ReactNode;

const MSG = defineMessages({
  selectMember: {
    id: 'SingleUserPicker.selectMember',
    defaultMessage: 'Select member',
  },
  emptyMessage: {
    id: 'SingleUserPicker.emptyMessage',
    defaultMessage: 'No Colony members match that search.',
  },
  remove: {
    id: 'SingleUserPicker.remove',
    defaultMessage: 'Remove',
  },
  closedCaret: {
    id: 'SingleUserPicker.closedCaret',
    defaultMessage: 'Closed user picker',
  },
  openedCaret: {
    id: 'SingleUserPicker.openedCaret',
    defaultMessage: 'Opened user picker',
  },
});

interface Appearance {
  direction?: 'horizontal';
  width?: 'wide';
}

interface Props extends WithOmnipickerInProps {
  /** Appearance object */
  appearance?: Appearance;

  /** Renders an extra button to remove selection */
  isResettable?: boolean;

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

  /* An option to show masked address next to display name for the selected item */
  showMaskedAddress?: boolean;
}

interface EnhancedProps extends Props, WrappedComponentProps {}

const displayName = 'SingleUserPicker';

const SingleUserPicker = ({
  appearance,
  disabled,
  elementOnly,
  help,
  helpValues,
  inputProps,
  isResettable,
  label,
  labelValues,
  name,
  OmniPicker,
  omniPickerIsOpen,
  OmniPickerWrapper,
  onSelected,
  openOmniPicker,
  placeholder,
  registerInputNode,
  renderAvatar = (address: Address, item?: ItemDataType<AnyUser>) => (
    <UserAvatar address={address} user={item} size="xs" />
  ),
  renderItem: renderItemProp,
  dataTest,
  itemDataTest,
  valueDataTest,
  showMaskedAddress = false,
}: EnhancedProps) => {
  const [
    ,
    { error, touched, value },
    { setValue, setTouched },
  ] = useField<AnyUser | null>(name);
  const { formatMessage } = useIntl();

  const handleActiveUserClick = useCallback(() => {
    if (!disabled) {
      setValue(null);
      openOmniPicker();
    }
  }, [disabled, openOmniPicker, setValue]);
  const handlePick = useCallback(
    (user: AnyUser) => {
      if (setValue) setValue(user);
      if (onSelected) onSelected(user);
    },
    [onSelected, setValue],
  );
  const resetSelection = useCallback(() => {
    if (!disabled && setValue) {
      setValue(null);
    }
  }, [disabled, setValue]);
  // Use custom render prop for item or the default one with the given renderAvatar function
  const renderItem =
    renderItemProp || // eslint-disable-next-line react-hooks/rules-of-hooks
    useCallback(
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

  const labelAppearance = appearance
    ? { direction: appearance.direction }
    : undefined;

  const placeholderText =
    !placeholder || typeof placeholder === 'string'
      ? placeholder
      : formatMessage(placeholder);

  return (
    <div className={styles.omniContainer}>
      <OmniPickerWrapper className={getMainClasses(appearance, styles)}>
        <div className={styles.inputContainer}>
          <InputLabel
            inputId={inputProps.id}
            label={label}
            labelValues={labelValues}
            help={help}
            helpValues={helpValues}
            appearance={labelAppearance}
            screenReaderOnly={elementOnly}
          />
          {value ? (
            <div className={styles.avatarContainer}>
              {renderAvatar(value.profile.walletAddress, value)}
            </div>
          ) : (
            <Icon
              className={omniPickerIsOpen ? styles.focusIcon : styles.icon}
              name="filled-circle-person"
              title={MSG.selectMember}
            />
          )}
          <div className={styles.container}>
            {
              /* eslint-disable jsx-a11y/click-events-have-key-events */
              value && (
                <button
                  type="button"
                  className={styles.recipientName}
                  onClick={handleActiveUserClick}
                  onFocus={handleActiveUserClick}
                  tabIndex={0}
                  disabled={disabled}
                  data-test={valueDataTest}
                >
                  {value.profile.displayName ||
                    value.profile.username ||
                    value.profile.walletAddress}
                  {showMaskedAddress && (
                    <span className={styles.maskedAddress}>
                      <MaskedAddress address={value.profile.walletAddress} />
                    </span>
                  )}
                </button>
              )
            }
            {/* eslint-enable jsx-a11y/click-events-have-key-events */}
            <input
              disabled={disabled}
              className={
                touched && error && !omniPickerIsOpen
                  ? styles.inputInvalid
                  : styles.input
              }
              {...inputProps}
              placeholder={placeholderText}
              hidden={!!value}
              ref={registerInputNode}
              data-test={dataTest}
              onBlur={() => setTouched(true)}
            />
            {error && appearance && appearance.direction === 'horizontal' && (
              <span className={styles.errorHorizontal}>{error}</span>
            )}
            <div className={styles.omniPickerContainer}>
              <OmniPicker renderItem={renderItem} onPick={handlePick} />
            </div>
            {(!value || (value && !isResettable)) && (
              <Icon
                {...(disabled ? {} : { onClick: openOmniPicker })}
                className={classnames(styles.arrowIcon, {
                  [styles.arrowIconActive]: omniPickerIsOpen,
                })}
                name="caret-down"
                title={omniPickerIsOpen ? MSG.openedCaret : MSG.closedCaret}
              />
            )}
          </div>
        </div>
      </OmniPickerWrapper>
      {value && isResettable && (
        <Button
          onClick={resetSelection}
          appearance={{ theme: 'blue', size: 'small' }}
          text={{ id: 'button.remove' }}
        />
      )}
    </div>
  );
};

SingleUserPicker.displayName = displayName;

const enhance = compose<EnhancedProps, Props>(withOmniPicker());

export default enhance(SingleUserPicker);
