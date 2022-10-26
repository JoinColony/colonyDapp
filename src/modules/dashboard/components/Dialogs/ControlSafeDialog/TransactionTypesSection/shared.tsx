import React from 'react';
import { FormattedMessage } from 'react-intl';

import Avatar from '~core/Avatar';
import { DialogSection } from '~core/Dialog';
import { SpinnerLoader } from '~core/Preloaders';
import { AnyUser } from '~data/index';
import { Address, Message } from '~types/index';

import styles from './TransactionTypesSection.css';

export const AvatarXS = (address: Address, item: AnyUser) => (
  <Avatar
    seed={address?.toLocaleLowerCase()}
    size="xs"
    notSet={false}
    title={item.profile.username || ''}
    placeholderIcon="at-sign-circle"
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
