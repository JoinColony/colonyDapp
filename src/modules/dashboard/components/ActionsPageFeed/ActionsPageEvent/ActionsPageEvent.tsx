import React from 'react';
import { FormattedMessage } from 'react-intl';

import Numeral from '~core/Numeral';
import { TransactionMeta, TransactionStatus } from '~dashboard/ActionsPage';
import UserPermissions from '~dashboard/UserPermissions';

import { AnyUser } from '~data/index';
import { getFriendlyName } from '../../../../users/transformers';
import { PaymentDetails } from '../ActionsPageFeed';
import { STATUS } from '../../ActionsPage/types';

import styles from './ActionsPageEvent.css';

const displayName = 'dashboard.ActionsPageFeed.ActionsPageEvent';

interface Props {
  eventName?: string;
  eventValues?: Record<string, any>;
  transactionHash: string;
  createdAt: Date;
  initiator?: AnyUser;
  recipient?: AnyUser;
  payment?: PaymentDetails;
  emmitedBy?: string;
}

const ActionsPageEvent = ({
  createdAt,
  transactionHash,
  eventName,
  initiator,
  recipient,
  payment,
  emmitedBy,
}: Props) => {
  // @TODO Mocked roles - Please make me smarter
  const roles = [1, 2, 3];
  const directRoles = [1, 2, 3];

  return (
    <div className={styles.main}>
      <div className={styles.status}>
        <TransactionStatus status={STATUS.Succeeded} showTooltip={false} />
      </div>
      <div className={styles.content}>
        <div className={styles.text}>
          <FormattedMessage
            id="event.title"
            values={{
              eventName,
              initiator: (
                <span className={styles.decoratedUser}>
                  {getFriendlyName(initiator)}
                </span>
              ),
              recipient: (
                <span className={styles.decoratedUser}>
                  {getFriendlyName(recipient)}
                </span>
              ),
              /*
               * @NOTE At some point with the help of events we'll be able to get
               * an actual payment name, rather than an id
               */
              paymentId: payment?.fromDomain || 1,
              amount: (
                <Numeral
                  value={payment?.amount || '0'}
                  /*
                   * @NOTE We don't need to call `getTokenDecimalsWithFallback` since
                   * we already did that when passing down the prop
                   */
                  unit={payment?.decimals}
                />
              ),
              tokenSymbol: <span>{payment?.symbol || '???'}</span>,
              eventNameDecorated: (
                <span className={styles.highlight}>{eventName}</span>
              ),
              clientOrExtensionType: (
                <span className={styles.highlight}>{emmitedBy}</span>
              ),
            }}
          />
        </div>
        <div className={styles.details}>
          <UserPermissions
            roles={roles}
            directRoles={directRoles}
            appearance={{ padding: 'none' }}
          />
          {transactionHash && (
            <TransactionMeta
              transactionHash={transactionHash}
              createdAt={createdAt}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ActionsPageEvent.displayName = displayName;

export default ActionsPageEvent;
