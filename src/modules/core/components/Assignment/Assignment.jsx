/* @flow */
import type { MessageDescriptor } from 'react-intl';
import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';

import styles from './Assignment.css';
import { getMainClasses } from '~utils/css';

import type {
  OmniPickerProps,
  OmniPickerItemComponent,
} from '~core/OmniPicker';

import { asField, InputLabel } from '~core/Fields';
import Icon from '~core/Icon';
import { withOmniPicker } from '~core/OmniPicker';
import UserAvatar from '~core/UserAvatar';
import Button from '~core/Button';

import type { Payout, UserData } from './types';

const MSG = defineMessages({
  selectMember: {
    id: 'Assignment.selectMember',
    defaultMessage: 'Select member',
  },
  emptyMessage: {
    id: 'Assignment.emptyMessage',
    defaultMessage: 'No Colony members match that search.',
  },
  remove: {
    id: 'dashboard.TaskList.TaskListItem.remove',
    defaultMessage: 'Remove',
  },
});

type Props = {
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
  $value?: UserData,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
} & OmniPickerProps;

class Assignment extends Component<Props> {
  static displayName = 'Assignment';

  handleActiveUserClick = () => {
    const { openOmniPicker, setValue } = this.props;
    setValue(null);
    openOmniPicker();
  };

  handlePick = (user: UserData) => {
    const { setValue } = this.props;
    setValue(user);
  };

  resetSelection = () => {
    const { setValue } = this.props;
    setValue(null);
  };

  render() {
    const {
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
    return (
      <div className={styles.omniContainer}>
        <OmniPickerWrapper>
          <div className={styles.inputContainer}>
            {!elementOnly &&
              label && (
                <InputLabel inputId={inputProps.id} label={label} help={help} />
              )}
            {$value ? (
              <div className={styles.avatarContainer}>
                <UserAvatar
                  className={styles.recipientAvatar}
                  userId={$value.id}
                  walletAddress={$value.id}
                  username={$value.username || $value.id}
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
                  className={styles.assigneeName}
                  onClick={this.handleActiveUserClick}
                  onFocus={this.handleActiveUserClick}
                  tabIndex="0"
                >
                  {$value.fullName}
                </div>
              )}
              {/* eslint-enable jsx-a11y/click-events-have-key-events */}
              <input
                className={
                  $touched && $error ? styles.inputInvalid : styles.input
                }
                {...inputProps}
                placeholder={placeholder}
                hidden={!!$value}
                ref={registerInputNode}
              />
              <div className={styles.omniPickerContainer}>
                <OmniPicker
                  itemComponent={itemComponent}
                  onPick={this.handlePick}
                />
              </div>
            </div>
          </div>
        </OmniPickerWrapper>
        {$value && (
          <Button
            onClick={this.resetSelection}
            appearance={{ theme: 'blue', size: 'small' }}
            text={MSG.remove}
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
export default enhance(Assignment);
