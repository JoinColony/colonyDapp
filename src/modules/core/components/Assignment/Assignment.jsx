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
import NavLink from '~core/NavLink';
import PayoutsList from '~core/PayoutsList';

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
  fundingNotSet: {
    id: 'Assignment.fundingNotSet',
    defaultMessage: 'Funding not set',
  },
  pendingAssignment: {
    id: 'Assignment.pendingAssignment',
    defaultMessage: 'Pending',
  },
  reputation: {
    id: 'dashboard.TaskList.TaskListItem.reputation',
    defaultMessage: '+{reputation} max rep',
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
  /** Array of payouts per token that has been set for a task */
  payouts?: Array<Payout>,
  /** current user reputation */
  reputation?: number,
} & OmniPickerProps;
type State = {
  pendingAssignment?: boolean,
};
class Assignment extends Component<Props, State> {
  static displayName = 'Assignment';

  state = {
    pendingAssignment: false,
  };

  handleActiveUserClick = () => {
    const { openOmniPicker, setValue } = this.props;
    setValue(null);
    openOmniPicker();
  };

  handlePick = (user: UserData) => {
    const { setValue } = this.props;
    this.setState({ pendingAssignment: true });
    setValue(user);
  };

  render() {
    const {
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
      // Funding
      payouts,
      reputation,
    } = this.props;
    const { pendingAssignment } = this.state;
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
                appearance={labelAppearance}
              />
            )}
          {$value ? (
            <NavLink to={`user/${$value.id}`}>
              <div className={styles.avatarContainer}>
                <UserAvatar
                  className={styles.recipientAvatar}
                  userId={$value.id}
                  walletAddress={$value.id}
                  username={$value.username || $value.id}
                  size="xs"
                />
              </div>
            </NavLink>
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
                className={
                  pendingAssignment ? styles.pending : styles.assigneeName
                }
                onClick={this.handleActiveUserClick}
                onFocus={this.handleActiveUserClick}
                tabIndex="0"
              >
                {$value.fullName}
                {pendingAssignment && (
                  <span className={styles.pendingLabel}>
                    <FormattedMessage {...MSG.pendingAssignment} />
                  </span>
                )}
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
          <div className={styles.fundingContainer}>
            {reputation && (
              // TODO: check if funding token is native once we have a helper for it
              <span className={styles.reputation}>
                <FormattedMessage
                  {...MSG.reputation}
                  values={{ reputation: reputation.toString() }}
                />
              </span>
            )}
            {payouts ? (
              <PayoutsList payouts={payouts} nativeToken="CLNY" maxLines={2} />
            ) : (
              <FormattedMessage {...MSG.fundingNotSet} />
            )}
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
export default enhance(Assignment);
