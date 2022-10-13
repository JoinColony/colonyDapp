import React from 'react';
import { FormattedMessage } from 'react-intl';

import { DialogSection } from '~core/Dialog';
import { SpinnerLoader } from '~core/Preloaders';
import UserAvatar from '~core/UserAvatar';
import { AnyUser } from '~data/index';
import { Address, Message } from '~types/index';

import styles from './TransactionTypesSection.css';

export const UserAvatarXs = (address: Address, item: AnyUser) => (
  <UserAvatar
    address={address.toLowerCase()}
    user={item}
    size="xs"
    notSet={false}
  />
);

interface LoadingProps {
  message: Message;
}

export const Loading = ({ message }: LoadingProps) => (
  <DialogSection>
    <div className={styles.spinner}>
      <SpinnerLoader appearance={{ size: 'medium' }} loadingText={message} />
    </div>
  </DialogSection>
);

interface ErrorMessageProps {
  error: Message;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => (
  <DialogSection>
    <div className={styles.error}>
      {typeof error === 'string' ? (
        <span>{error}</span>
      ) : (
        <FormattedMessage {...error} />
      )}
    </div>
  </DialogSection>
);
