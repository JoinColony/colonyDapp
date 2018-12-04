/* @flow */

import type { MessageDescriptor, MessageValues } from 'react-intl';

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import { compose } from 'recompose';

import styles from './SingleUserPicker.css';

import { getMainClasses } from '~utils/css';

import type { OmniPickerProps, OmniPickerItemComponent } from '../OmniPicker';

import { asField, InputLabel } from '../Fields';
import Icon from '../Icon';
import Button from '../Button';
import { withOmniPicker } from '../OmniPicker';
import UserAvatar from '../UserAvatar';

import type { UserRecord } from '~types/index';

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

type Appearance = {
  direction?: 'horizontal',
};

type Props = {
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
  /** Item component for omnipicker listbox */
  itemComponent: OmniPickerItemComponent,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: MessageValues,
  /** Placeholder for input */
  placeholder?: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  $value?: UserRecord,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
} & OmniPickerProps;

type State = {
  selectedUser: ?UserRecord,
};

class SingleUserPicker extends Component<Props, State> {
  static displayName = 'SingleUserPicker';

  handleActiveUserClick = () => {
    const { openOmniPicker, setValue } = this.props;
    setValue(null);
    openOmniPicker();
  };

  handlePick = (user: UserRecord) => {
    const { setValue } = this.props;
    setValue(user);
  };

  resetSelection = () => {
    const { setValue } = this.props;
    setValue(null);
  };

  render() {
    const {
      isResettable,
      disabled,
      appearance,
      itemComponent,
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
    } = this.props;

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
                <UserAvatar
                  className={styles.recipientAvatar}
                  userId={$value.walletAddress}
                  walletAddress={$value.walletAddress}
                  username={$value.username || $value.walletAddress}
                  size="xs"
                />
              </div>
            ) : (
              <Icon
                className={omniPickerIsOpen ? styles.focusIcon : styles.icon}
                name="circle-person"
                title={MSG.selectMember}
              />
            )}
            {}
            <div className={styles.container}>
              {/* eslint-disable jsx-a11y/click-events-have-key-events */
              $value && (
                <div
                  role="button"
                  className={styles.recipientName}
                  onClick={this.handleActiveUserClick}
                  onFocus={this.handleActiveUserClick}
                  tabIndex="0"
                >
                  {$value.displayName}
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
              {$error &&
                appearance &&
                appearance.direction === 'horizontal' && (
                  <span className={styles.errorHorizontal}>{$error}</span>
                )}
              <div className={styles.omniPickerContainer}>
                <OmniPicker
                  itemComponent={itemComponent}
                  onPick={this.handlePick}
                />
              </div>
            </div>
          </div>
        </OmniPickerWrapper>
        {$value && isResettable && (
          <Button
            onClick={this.resetSelection}
            appearance={{ theme: 'blue', size: 'small' }}
            text={{ id: 'button.remove' }}
          />
        )}
      </div>
    );
  }
}

const enhance = compose(
  asField(),
  withOmniPicker(),
);

export default enhance(SingleUserPicker);
