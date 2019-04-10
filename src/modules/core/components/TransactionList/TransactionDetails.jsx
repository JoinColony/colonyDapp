/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import MaskedAddress from '~core/MaskedAddress';
import Link from '~core/Link';

import styles from './TransactionDetails.css';

import type {
  ColonyType,
  ContractTransactionType,
  DataType,
  TaskType,
  UserType,
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

type Props = {|
  /*
   * User data Object, follows the same format as UserPicker
   */
  transaction: ContractTransactionType,
  colony?: DataType<ColonyType>,
  task?: TaskType,
  user?: UserType,
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
|};

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

const ColonyDetails = ({
  colony: { displayName: colonyDisplayName, colonyAddress },
}: {
  colony: ColonyType,
}) => (
  <span>
    {colonyDisplayName && <span>{`${colonyDisplayName} `}</span>}
    {!colonyDisplayName && colonyAddress && <span>{colonyAddress}</span>}
  </span>
);

const TaskDetails = ({ task }: { task: TaskType }) => (
  <span>
    {task.title && (
      <Link
        text={task.title}
        to={`/colony/${task.colonyENSName}/task/${task.draftId}`}
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
                    user={user && user && user.profile}
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
          {!from && task && (
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
                        <MaskedAddress address={colony.record.colonyAddress} />
                      ) : (
                        colony.record.colonyAddress
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
                        <MaskedAddress address={colony.record.colonyAddress} />
                      ) : (
                        colony.record.colonyAddress
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
                    user={user && user && user.profile}
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
          {!to && task && (
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
