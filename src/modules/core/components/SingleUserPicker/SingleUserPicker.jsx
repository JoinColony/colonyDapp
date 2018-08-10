/* @flow */

import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import { compose } from 'recompose';

import styles from './SingleUserPicker.css';

import { getMainClasses } from '~utils/css';

import type { OmniPickerProps, OmniPickerItemComponent } from '../OmniPicker';

import { asField, InputLabel } from '../Fields';
import Icon from '../Icon';
import { withOmniPicker } from '../OmniPicker';
// import UserAvatar from '../../../users/components/UserAvatar';

type UserData = {
  id: string,
  fullName: string,
};

const MSG = defineMessages({
  selectMember: {
    id: 'SingleUserPicker.selectMember',
    defaultMessage: 'Select member',
  },
  emptyMessage: {
    id: 'SingleUserPicker.emptyMessage',
    defaultMessage: 'No Colony members match that search.',
  },
});

// TODO: Replace with proper UserAvatar component
const UserAvatar = () => (
  <Icon
    className={styles.focusIcon}
    name="circle-person"
    title={MSG.selectMember}
  />
);

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
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** Item component for omnipicker listbox */
  itemComponent: OmniPickerItemComponent,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** Placeholder for input */
  placeholder?: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  $value?: string,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
} & OmniPickerProps;

type State = {
  selectedUser: ?UserData,
};

class SingleUserPicker extends Component<Props, State> {
  static displayName = 'SingleUserPicker';

  state = {
    selectedUser: null,
  };

  handleActiveUserClick = () => {
    const { inputNode } = this.props;
    this.setState(
      {
        selectedUser: null,
      },
      () => {
        if (inputNode) inputNode.focus();
      },
    );
  };

  handlePick = (user: UserData) => {
    this.setState({
      selectedUser: user,
    });
  };

  render() {
    const {
      appearance,
      itemComponent,
      // Form field
      $error,
      $touched,
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

    const { selectedUser } = this.state;
    const labelAppearance = appearance
      ? { direction: appearance.direction }
      : undefined;
    return (
      <OmniPickerWrapper className={getMainClasses(appearance, styles)}>
        <div className={styles.inputContainer}>
          {!elementOnly &&
            label && (
              <InputLabel
                inputId={inputProps.id}
                label={label}
                help={help}
                error={$error}
                appearance={labelAppearance}
              />
            )}
          {selectedUser ? (
            <div className={styles.avatarContainer}>
              <UserAvatar
                className={styles.recipientAvatar}
                userId={selectedUser.id}
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
            selectedUser && (
              <div
                role="button"
                className={styles.recipientName}
                onClick={this.handleActiveUserClick}
                onFocus={this.handleActiveUserClick}
                tabIndex="0"
              >
                {selectedUser.fullName}
              </div>
            )}
            {/* eslint-enable jsx-a11y/click-events-have-key-events */}
            <input
              className={
                $touched && $error ? styles.inputInvalid : styles.input
              }
              {...inputProps}
              placeholder={placeholder}
              hidden={selectedUser}
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
    );
  }
}

const enhance = compose(
  asField(),
  withOmniPicker(),
);

export default enhance(SingleUserPicker);
