import React, { ReactNode, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import compose from 'recompose/compose';

import { asField } from '~core/Fields';
import { AsFieldEnhancedProps, ExtraFieldProps } from '~core/Fields/types';
import { AnyUser } from '~data/index';
import { Address } from '~types/index';
import { getMainClasses } from '~utils/css';

import {
  ItemDataType,
  withOmniPicker,
  WrappedComponentProps,
} from '../OmniPicker';
import { Props as WithOmnipickerInProps } from '../OmniPicker/withOmniPicker';
import { InputLabel } from '../Fields';
import Icon from '../Icon';
import Button from '../Button';
import UserAvatar from '../UserAvatar';
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
});

const defaultRenderAvatar = (
  address: Address,
  item?: ItemDataType<AnyUser>,
) => <UserAvatar address={address} user={item} size="xs" />;

const defaultRenderItem = (
  user: ItemDataType<AnyUser>,
  renderAvatar: AvatarRenderFn,
) => (
  <ItemDefault itemData={user} renderAvatar={renderAvatar} showMaskedAddress />
);

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

  name: string;

  /** Override avatar rendering */
  renderAvatar: AvatarRenderFn;

  /** Item component for omnipicker listbox */
  renderItem?: (user: ItemDataType<AnyUser>, selected?: boolean) => ReactNode;

  /** Callback for things that happend after selection  */
  onSelected?: (user: AnyUser) => void;

  value?: AnyUser;
}

interface EnhancedProps
  extends Props,
    AsFieldEnhancedProps<AnyUser>,
    WrappedComponentProps {}

const displayName = 'SingleUserPicker';

const SingleUserPicker = ({
  // Form field
  elementOnly,
  help,
  label,
  placeholder,
  $value,
  $error,
  $touched,
  onSelected,
  formatIntl,
  setValue,
  // OmniPicker
  inputProps,
  OmniPicker,
  OmniPickerWrapper,
  omniPickerIsOpen,
  registerInputNode,
  // Rest
  appearance,
  disabled,
  isResettable,
  renderAvatar = defaultRenderAvatar,
  renderItem: renderItemProp,
  openOmniPicker,
}: EnhancedProps) => {
  const handleActiveUserClick = useCallback(() => {
    if (!disabled) {
      if (setValue) setValue(null);
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
      (user: ItemDataType<AnyUser>) => defaultRenderItem(user, renderAvatar),
      [renderAvatar],
    );

  const labelAppearance = appearance
    ? { direction: appearance.direction }
    : undefined;

  const placeholderText =
    !placeholder || typeof placeholder === 'string'
      ? placeholder
      : formatIntl(placeholder);

  return (
    <div className={styles.omniContainer}>
      <OmniPickerWrapper className={getMainClasses(appearance, styles)}>
        <div className={styles.inputContainer}>
          {!elementOnly && label && (
            <InputLabel
              inputId={inputProps.id}
              label={label}
              help={help}
              appearance={labelAppearance}
            />
          )}
          {$value ? (
            <div className={styles.avatarContainer}>
              {renderAvatar($value.profile.walletAddress, $value)}
            </div>
          ) : (
            <Icon
              className={omniPickerIsOpen ? styles.focusIcon : styles.icon}
              name="circle-person"
              title={MSG.selectMember}
            />
          )}
          <div className={styles.container}>
            {/* eslint-disable jsx-a11y/click-events-have-key-events */
            $value && (
              <div
                role="button"
                className={styles.recipientName}
                onClick={handleActiveUserClick}
                onFocus={handleActiveUserClick}
                tabIndex={0}
              >
                {$value.profile.displayName ||
                  $value.profile.username ||
                  $value.profile.walletAddress}
              </div>
            )}
            {/* eslint-enable jsx-a11y/click-events-have-key-events */}
            <input
              disabled={disabled}
              className={
                $touched && $error ? styles.inputInvalid : styles.input
              }
              {...inputProps}
              placeholder={placeholderText}
              hidden={!!$value}
              ref={registerInputNode}
            />
            {$error && appearance && appearance.direction === 'horizontal' && (
              <span className={styles.errorHorizontal}>{$error}</span>
            )}
            <div className={styles.omniPickerContainer}>
              <OmniPicker renderItem={renderItem} onPick={handlePick} />
            </div>
          </div>
        </div>
      </OmniPickerWrapper>
      {$value && isResettable && (
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

const enhance = compose<EnhancedProps, Props & ExtraFieldProps<AnyUser>>(
  withOmniPicker(),
  asField<Props, AnyUser>(),
);

export default enhance(SingleUserPicker);
