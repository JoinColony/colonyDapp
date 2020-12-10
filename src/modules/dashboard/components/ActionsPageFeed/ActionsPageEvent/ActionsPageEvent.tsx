import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import Numeral from '~core/Numeral';
import FriendlyUserName from '~core/FriendlyUserName';
import { TransactionMeta, TransactionStatus } from '~dashboard/ActionsPage';
import UserPermissions from '~dashboard/UserPermissions';
import { AnyUser } from '~data/index';
import { ColonyAndExtensionsEvents } from '~types/index';

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

interface Roles {
  roles: ColonyRole[];
  directRoles: ColonyRole[];
}

type RolesMap = Partial<
  {
    [key in ColonyAndExtensionsEvents]: Roles;
  }
>;

/*
 * @NOTE Event roles are stating, so we just need to create a manual map
 * Containing the actual event, and the role(s)
 */
const ROLES_MAP: RolesMap = {
  [ColonyAndExtensionsEvents.OneTxPaymentMade]: {
    roles: [ColonyRole.Administration],
    directRoles: [ColonyRole.Administration],
  },
  [ColonyAndExtensionsEvents.Generic]: {
    roles: [],
    directRoles: [],
  },
};

const ActionsPageEvent = ({
  createdAt,
  transactionHash,
  eventName = ColonyAndExtensionsEvents.Generic,
  initiator,
  recipient,
  payment,
  emmitedBy,
}: Props) => (
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
                <FriendlyUserName
                  user={initiator as AnyUser}
                  autoShrinkAddress
                />
              </span>
            ),
            recipient: (
              <span className={styles.decoratedUser}>
                <FriendlyUserName
                  user={recipient as AnyUser}
                  autoShrinkAddress
                />
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
          {...ROLES_MAP[eventName]}
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

ActionsPageEvent.displayName = displayName;

export default ActionsPageEvent;
