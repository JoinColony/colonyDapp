import React, { ComponentType, ReactNode } from 'react';
import classNames from 'classnames';

import styles from './SingleUserPicker.css';
import localStyles from './UserPickerWithSearch.css';
import Icon from '~core/Icon';
import { Props as SingleUserPickerProps, MSG } from './SingleUserPicker';
import { ItemDataType } from '~core/OmniPicker';
import { AnyUser } from '~data/index';

interface Props
  extends Pick<
    SingleUserPickerProps,
    'renderAvatar' | 'disabled' | 'appearance' | 'valueDataTest' | 'dataTest'
  > {
  omniPickerIsOpen?: boolean;
  handleActiveUserClick: VoidFunction;
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
          <div className={styles.avatarContainer}>
            {renderAvatar(value.profile.walletAddress, value)}
          </div>
        ) : (
          <Icon
            className={omniPickerIsOpen ? styles.focusIcon : localStyles.icon}
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
            className={classNames(styles.arrowIcon, {
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
