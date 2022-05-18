import React, { ComponentType, ReactNode } from 'react';
import classNames from 'classnames';

import { defineMessages } from 'react-intl';
import styles from './SingleUserPicker.css';
import localStyles from './UserPickerWithSearch.css';
import Icon from '~core/Icon';
import { Props as SingleUserPickerProps } from './SingleUserPicker';
import { ItemDataType } from '~core/OmniPicker';
import { AnyUser } from '~data/index';

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
interface Props
  extends Pick<
    SingleUserPickerProps,
    'renderAvatar' | 'disabled' | 'appearance' | 'valueDataTest' | 'dataTest'
  > {
  omniPickerIsOpen?: boolean;
  handleActiveUserClick: () => void;
  error?: string;
  handlePick: (user: AnyUser) => void;
  touched?: boolean;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  placeholderText?: string;
  registerInputNode: (inputNode: HTMLInputElement | null) => void;
  openOmniPicker: () => void;
  renderItem: (
    user: ItemDataType<AnyUser>,
    selected?: boolean | undefined,
  ) => ReactNode;
  isResettable?: boolean;
  value?: AnyUser | null;
  OmniPicker: ComponentType<any>;
}

const UserPickerWithSearch = ({
  value,
  renderAvatar,
  omniPickerIsOpen,
  handleActiveUserClick,
  disabled,
  appearance,
  valueDataTest,
  error,
  renderItem,
  handlePick,
  touched,
  inputProps,
  placeholderText,
  registerInputNode,
  dataTest,
  isResettable,
  openOmniPicker,
  OmniPicker,
}: Props) => {
  return (
    <>
      <div className={localStyles.inputWithIcon}>
        {value ? (
          /* eslint-disable jsx-a11y/click-events-have-key-events */
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className={styles.avatarContainer}
            onClick={handleActiveUserClick}
          >
            {renderAvatar(value.profile.walletAddress, value)}
          </div>
        ) : (
          /* eslint-enable jsx-a11y/click-events-have-key-events */
          <Icon
            className={omniPickerIsOpen ? styles.focusIcon : localStyles.icon}
            name="filled-circle-person"
            title={MSG.selectMember}
            onClick={handleActiveUserClick}
          />
        )}
        <div className={styles.container}>
          {
            /* eslint-disable jsx-a11y/click-events-have-key-events */
            value && (
              <button
                type="button"
                className={classNames(
                  localStyles.recipientName,
                  appearance?.size === 'small' && localStyles.small,
                )}
                onClick={handleActiveUserClick}
                onFocus={handleActiveUserClick}
                tabIndex={0}
                disabled={disabled}
                data-test={valueDataTest}
              >
                {value.profile.displayName ||
                  value.profile.username ||
                  value.profile.walletAddress}
              </button>
            )
          }
          {/* eslint-enable jsx-a11y/click-events-have-key-events */}
        </div>
        <div className={localStyles.omniPickerContainer}>
          <OmniPicker
            renderItem={renderItem}
            onPick={handlePick}
            height="large"
          >
            <div className={localStyles.inputWrapper}>
              <input
                disabled={disabled}
                className={
                  touched && error ? styles.inputInvalid : localStyles.input
                }
                {...inputProps}
                placeholder={placeholderText}
                ref={registerInputNode}
                data-test={dataTest}
              />
            </div>
          </OmniPicker>
        </div>
        {(!value || (value && !isResettable)) && (
          <Icon
            {...(disabled ? {} : { onClick: openOmniPicker })}
            className={classNames(localStyles.arrowIcon, {
              [styles.arrowIconActive]: omniPickerIsOpen,
            })}
            name="caret-down-small"
            title={omniPickerIsOpen ? MSG.openedCaret : MSG.closedCaret}
          />
        )}
      </div>
    </>
  );
};

export default UserPickerWithSearch;
