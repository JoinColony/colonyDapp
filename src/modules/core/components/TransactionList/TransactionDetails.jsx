/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import MaskedAddress from '~core/MaskedAddress';
import Link from '~core/Link';

import styles from './TransactionDetails.css';

import type {
  ColonyRecord,
  ContractTransactionRecord,
  DataRecord,
  TaskRecord,
  UserRecord,
} from '~immutable';

const MSG = defineMessages({
  fromText: {
    id: 'admin.TransactionList.TransactionDetails.fromText',
    defaultMessage: 'From {senderString}',
  },
  toText: {
    id: 'admin.TransactionList.TransactionDetails.toText',
    defaultMessage: 'To {recipientString}',
  },
});

/*
 * And the chain goes on... :(
 */
const displayName = 'admin.TransactionList.TransactionDetails';

type Props = {
  /*
   * User data Object, follows the same format as UserPicker
   */
  transaction: ContractTransactionRecord,
  colony?: DataRecord<ColonyRecord>,
  task?: TaskRecord,
  user?: DataRecord<UserRecord>,
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
  user: { displayName: userDisplayName = '', username = '' } = {},
  address = '',
}: Object) => (
  <span>
    {userDisplayName && <span>{`${userDisplayName} `}</span>}
    {username && <span>{`@${username} `}</span>}
    {!userDisplayName && !username && address && <span>{address}</span>}
  </span>
);

const ColonyDetails = ({ colony }: { colony: ColonyRecord }) => (
  <span>
    {colony.name && <span>{`${colony.name} `}</span>}
    {!colony.name && colony.address && <span>{colony.address}</span>}
  </span>
);

const TaskDetails = ({ task }: { task: TaskRecord }) => (
  <span>
    {task.title && task.id && (
      <Link
        text={task.title}
        to={`/colony/${task.colonyENSName}/task/${task.id}`}
        className={styles.taskLink}
      />
    )}
  </span>
);

const TransactionDetails = ({
  transaction: { from = '', to = '' },
  colony,
  task,
  user,
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
          {from && !(to && colony && colony.record) && (
            <FormattedMessage
              {...MSG.fromText}
              values={{
                senderString: (
                  <UserDetails
                    user={user && user.record && user.record.profile}
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
          {!from && task && task.id && (
            <FormattedMessage
              {...MSG.fromText}
              values={{ senderString: <TaskDetails task={task} /> }}
            />
          )}
          {/*
           * From a Colony
           */}
          {to && colony && colony.record && (
            <FormattedMessage
              {...MSG.fromText}
              values={{
                senderString: (
                  <ColonyDetails
                    colony={colony.record}
                    address={
                      showMaskedAddress ? (
                        <MaskedAddress address={colony.record.address} />
                      ) : (
                        colony.record.address
                      )
                    }
                  />
                ),
              }}
            />
          )}
        </p>
        {/*
         * To the colony
         */}
        <p className={styles.secondaryText}>
          {!to && colony && colony.record && (
            <FormattedMessage
              {...MSG.toText}
              values={{
                recipientString: (
                  <ColonyDetails
                    colony={colony.record}
                    address={
                      showMaskedAddress ? (
                        <MaskedAddress address={colony.record.address} />
                      ) : (
                        colony.record.address
                      )
                    }
                  />
                ),
              }}
            />
          )}
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
          {to && !(from && colony && colony.record) && (
            <FormattedMessage
              {...MSG.toText}
              values={{
                recipientString: (
                  <UserDetails
                    user={user && user.record && user.record.profile}
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
          {!to && task && task.id && (
            <FormattedMessage
              {...MSG.toText}
              values={{ recipientString: <TaskDetails task={task} /> }}
            />
          )}
          {/*
           * To a Colony
           */}
          {from && colony && colony.record && (
            <FormattedMessage
              {...MSG.toText}
              values={{
                recipientString: (
                  <ColonyDetails
                    colony={colony.record}
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
        </p>
        {/*
         * From the colony
         */}
        <p className={styles.secondaryText}>
          {!from && colony && colony.record && (
            <FormattedMessage
              {...MSG.fromText}
              values={{
                senderString: (
                  <ColonyDetails
                    colony={colony.record}
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
        </p>
      </div>
    )}
  </div>
);

TransactionDetails.displayName = displayName;

export default TransactionDetails;
