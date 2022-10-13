import React from 'react';

import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { AnyUser } from '~data/index';
import { Address } from '~types/index';
import UserAvatar from '~core/UserAvatar';
import { DialogSection } from '~core/Dialog';
import { SpinnerLoader } from '~core/Preloaders';
import styles from './TransactionTypesSection.css';

export { default as TransferFundsSection } from './TransferFundsSection';
export { default as RawTransactionSection } from './RawTransactionSection';
export { default as ContractInteractionSection } from './ContractInteractionSection';
export { default as TransferNFTSection } from './TransferNFTSection';

export const displayName = `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection`;

export const XsUserAvatar = (address: Address, item: AnyUser) => (
  <UserAvatar
    address={address.toLowerCase()}
    user={item}
    size="xs"
    notSet={false}
  />
);

export type MsgType = MessageDescriptor | string;

interface LoadingProps {
  message: MsgType;
}

const Loading = ({ message }: LoadingProps) => (
  <DialogSection>
    <div className={styles.spinner}>
      <SpinnerLoader appearance={{ size: 'medium' }} loadingText={message} />
    </div>
  </DialogSection>
);

Loading.displayName = `${displayName}.Loading`;

interface ErrorProps {
  error: MsgType;
}

const Error = ({ error }: ErrorProps) => (
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

Error.displayName = `${displayName}.Error`;

export { Loading, Error };
