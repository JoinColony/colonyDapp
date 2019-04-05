/* @flow */

import type { Node } from 'react';
import type { MessageDescriptor, MessageValues } from 'react-intl';

// $FlowFixMe Update flow
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import compose from 'recompose/compose';

import type { UserType } from '~immutable';

import { getMainClasses } from '~utils/css';

import type { ItemDataType, OmniPickerProps } from '../OmniPicker';

import { asField, InputLabel } from '../Fields';
import Icon from '../Icon';
import Button from '../Button';
import { withOmniPicker } from '../OmniPicker';
import UserAvatar from '../UserAvatar';

import ItemDefault from './ItemDefault.jsx';

import styles from './SingleUserPicker.css';

type AvatarRenderFn = (address: string, user: ItemDataType<UserType>) => Node;

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

const defaultRenderAvatar = (address: string, item: ItemDataType<UserType>) => {
  const { id, ...user } = item;
  return (
    <UserAvatar
      address={address}
      className={styles.recipientAvatar}
      user={user}
      size="xs"
    />
  );
};

const defaultRenderItem = (
  user: ItemDataType<UserType>,
  renderAvatar: AvatarRenderFn,
) => (
  <ItemDefault itemData={user} renderAvatar={renderAvatar} showMaskedAddress />
);

type Appearance = {
  direction?: 'horizontal',
};

type Props = {|
  /** Appearance object */
  appearance?: Appearance,
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean,
  /** Just render the `<textarea>` element without label */
  elementOnly?: boolean,
  /** Textarea field name (form variable) */
  name: string,
  /** Renders an extra button to remove selection */
  isResettable?: boolean,
  /** Renders an extra button to remove selection */
  disabled?: boolean,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: MessageValues,
  /** Override avatar rendering */
  renderAvatar: AvatarRenderFn,
  /** Item component for omnipicker listbox */
  renderItem?: (user: ItemDataType<UserType>, selected?: boolean) => Node,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: MessageValues,
  /** Placeholder for input */
  placeholder?: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  $value?: ItemDataType<UserType>,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
|} & OmniPickerProps;

const displayName = 'SingleUserPicker';

const SingleUserPicker = ({
  // Form field
  $error,
  $touched,
  $value,
  elementOnly,
  help,
  label,
  placeholder,
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
  setValue,
}: Props) => {
  const handleActiveUserClick = useCallback(
    () => {
      setValue(null);
      openOmniPicker();
    },
    [openOmniPicker, setValue],
  );
  const handlePick = useCallback((user: UserType) => setValue(user), [
    setValue,
  ]);
  const resetSelection = useCallback(() => setValue(null), [setValue]);
  // Use custom render prop for item or the default one with the given renderAvatar function
  const renderItem =
    renderItemProp ||
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCallback(
      (user: ItemDataType<UserType>) => defaultRenderItem(user, renderAvatar),
      [renderAvatar],
    );

  const labelAppearance = appearance
    ? { direction: appearance.direction }
    : undefined;

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
                tabIndex="0"
              >
                {$value.profile.displayName}
              </div>
            )}
            {/* eslint-enable jsx-a11y/click-events-have-key-events */}
            <input
              disabled={disabled}
              className={
                $touched && $error ? styles.inputInvalid : styles.input
              }
              {...inputProps}
              placeholder={placeholder}
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

const enhance = compose(
  asField(),
  withOmniPicker(),
);

export default enhance(SingleUserPicker);
