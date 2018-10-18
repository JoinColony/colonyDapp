/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import MaskedAddress from '~core/MaskedAddress';

import styles from './TransactionDetails.css';

import type { TransactionType } from '~types/transaction';

const MSG = defineMessages({
  fromText: {
    id: 'admin.TransactionList.TransactionListItem.TransactionDetails.fromText',
    defaultMessage: 'From {senderString}',
  },
  toText: {
    id: 'admin.TransactionList.TransactionListItem.TransactionDetails.toText',
    defaultMessage: 'To {recipientString}',
  },
});

/*
 * And the chain goes on... :(
 */
const displayName =
  'admin.TransactionList.TransactionListItem.TransactionDetails';

type Props = {
  /*
   * User data Object, follows the same format as UserPicker
   */
  transaction: TransactionType,
  /*
   * The user's address will always be shown, this just controlls if it's
   * shown in full, or masked.
   * Gets passed down to `UserListItem`
   */
  showMaskedAddress?: boolean,
  /*
   * To mark the transaction as either incoming or outgoing.
   *
   * This value is set by the Transaction list by comparing the transaction's
   * addresses with the current colony's one
   */
  incoming?: boolean,
};

/*
 * @NOTE I'm in doubt weather to export these three formatting components to
 * they're own file or to just leave them here.
 *
 * There are good argumnets to both sides...
 */

const UserDetails = ({
  displayName: userDisplayName = '',
  username = '',
  address = '',
}: Object) => (
  <span>
    {userDisplayName && <span>{`${userDisplayName} `}</span>}
    {username && <span>{`@${username} `}</span>}
    {address && <span>{address}</span>}
  </span>
);

const ColonyDetails = ({ name = '', address = '' }: Object) => (
  <span>
    {name && <span>{`${name} `}</span>}
    {address && <span>{address}</span>}
  </span>
);

const TaskDetails = ({ title = '' }: Object) => (
  <span>{title && <span>{title}</span>}</span>
);

const TransactionDetails = ({
  transaction: { from = '', to = '', userDetails, colonyDetails, task },
  showMaskedAddress = true,
  incoming = true,
}: Props) => (
  <div className={styles.main}>
    {/*
      * Incoming transaction
      */}
    {incoming && (
      <div>
        <p className={styles.primaryText}>
          {/*
            * From a user
            */}
          {from && (
            <FormattedMessage
              {...MSG.fromText}
              values={{
                senderString: (
                  <UserDetails
                    {...userDetails}
                    address={
                      showMaskedAddress ? (
                        <MaskedAddress address={from} />
                      ) : (
                        from
                      )
                    }
                  />
                ),
              }}
            />
          )}
          {/*
            * From a task
            */}
          {task &&
            task.id && (
              <FormattedMessage
                {...MSG.fromText}
                values={{ senderString: <TaskDetails {...task} /> }}
              />
            )}
        </p>
        {/*
          * To the colony
          */}
        <p className={styles.secondaryText}>
          <FormattedMessage
            {...MSG.toText}
            values={{
              recipientString: (
                <ColonyDetails
                  {...colonyDetails}
                  address={
                    showMaskedAddress ? <MaskedAddress address={to} /> : to
                  }
                />
              ),
            }}
          />
        </p>
      </div>
    )}
    {/*
      * Outgoing transaction
      */}
    {!incoming && (
      <div>
        <p className={styles.primaryText}>
          {/*
            * To a user
            */}
          {to && (
            <FormattedMessage
              {...MSG.toText}
              values={{
                recipientString: (
                  <UserDetails
                    {...userDetails}
                    address={
                      showMaskedAddress ? <MaskedAddress address={to} /> : to
                    }
                  />
                ),
              }}
            />
          )}
          {/*
            * To a task
            */}
          {task &&
            task.id && (
              <FormattedMessage
                {...MSG.toText}
                values={{ recipientString: <TaskDetails {...task} /> }}
              />
            )}
        </p>
        {/*
          * From the colony
          */}
        <p className={styles.secondaryText}>
          <FormattedMessage
            {...MSG.fromText}
            values={{
              senderString: (
                <ColonyDetails
                  {...colonyDetails}
                  address={
                    showMaskedAddress ? <MaskedAddress address={from} /> : from
                  }
                />
              ),
            }}
          />
        </p>
      </div>
    )}
  </div>
);

TransactionDetails.displayName = displayName;

export default TransactionDetails;
