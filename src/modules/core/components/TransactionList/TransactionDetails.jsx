/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDataFetcher } from '~utils/hooks';
import { colonyFetcher } from '../../../dashboard/fetchers';

import MaskedAddress from '~core/MaskedAddress';
import Link from '~core/Link';

import styles from './TransactionDetails.css';

import type { ENSName } from '~types';
import type {
  ColonyType,
  ContractTransactionType,
  TaskType,
  UserProfileType,
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
  untitled: {
    id: 'dashboard.TaskList.TaskListItem.untitled',
    defaultMessage: 'Untitled task',
  },
});

/*
 * And the chain goes on... :(
 */
const displayName = 'admin.TransactionList.TransactionDetails';

type Props = {|
  transaction: ContractTransactionType,
  task?: TaskType,
  user?: UserProfileType,
  /*
   * User and colony addresses will always be shown; this controls whether the
   * address is shown in full, or masked.
   */
  showMaskedAddress?: boolean,
|};

type HookedProps = {|
  ...Props,
  colony: ?ColonyType,
|};

const UserDetails = ({
  user: {
    displayName: userDisplayName = '',
    username = '',
    walletAddress = '',
  } = {},
  address = walletAddress,
  showMaskedAddress,
}: {|
  address: string,
  showMaskedAddress?: boolean,
  user?: UserProfileType,
|}) => (
  <span>
    {userDisplayName && <span>{`${userDisplayName} `}</span>}
    {username && <span>{`@${username} `}</span>}
    {!userDisplayName && !username && address && (
      <span>
        {showMaskedAddress ? <MaskedAddress address={address} /> : address}
      </span>
    )}
  </span>
);

const ColonyDetails = ({
  colony: { displayName: colonyDisplayName, colonyAddress },
  address = colonyAddress,
  showMaskedAddress,
}: {|
  colony: ColonyType,
  address?: string,
  showMaskedAddress?: boolean,
|}) => (
  <span>
    {colonyDisplayName && <span>{`${colonyDisplayName} `}</span>}
    {!colonyDisplayName && address && (
      <span>
        {showMaskedAddress ? <MaskedAddress address={address} /> : address}
      </span>
    )}
  </span>
);

const TaskDetails = ({
  colonyName,
  task: { draftId, title },
}: {
  task: TaskType,
  colonyName: ENSName,
}) => (
  <span>
    <Link
      text={title || MSG.untitled}
      to={`/colony/${colonyName}/task/${draftId}`}
      className={styles.taskLink}
    />
  </span>
);

const IncomingTransaction = ({
  colony,
  showMaskedAddress,
  task,
  transaction: { from = '', to = '' },
  user,
}: HookedProps) => (
  <div>
    <p className={styles.primaryText}>
      {/*
       * From a user
       */}
      {from && !(to && colony) && (
        <FormattedMessage
          {...MSG.fromText}
          values={{
            senderString: <UserDetails user={user} address={from} />,
          }}
        />
      )}
      {/*
       * From a task
       */}
      {!from && task && colony && (
        <FormattedMessage
          {...MSG.fromText}
          values={{
            senderString: (
              <TaskDetails
                colonyName={colony && colony.colonyName}
                task={task}
              />
            ),
          }}
        />
      )}
      {/*
       * From a Colony
       */}
      {to && colony && (
        <FormattedMessage
          {...MSG.fromText}
          values={{
            senderString: (
              <ColonyDetails
                colony={colony}
                showMaskedAddress={showMaskedAddress}
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
      {!to && colony && (
        <FormattedMessage
          {...MSG.toText}
          values={{
            recipientString: (
              <ColonyDetails
                colony={colony}
                showMaskedAddress={showMaskedAddress}
              />
            ),
          }}
        />
      )}
    </p>
  </div>
);

const OutgoingTransaction = ({
  colony,
  showMaskedAddress,
  task,
  transaction: { from = '', to = '' },
  user,
}: {|
  ...Props,
  colony: ?ColonyType,
|}) => (
  <div>
    <p className={styles.primaryText}>
      {/*
       * To a user
       */}
      {to && !(from && colony) && (
        <FormattedMessage
          {...MSG.toText}
          values={{
            recipientString: <UserDetails user={user} address={to} />,
          }}
        />
      )}
      {/*
       * To a task
       */}
      {!to && task && colony && (
        <FormattedMessage
          {...MSG.toText}
          values={{
            recipientString: (
              <TaskDetails task={task} colonyName={colony.colonyName} />
            ),
          }}
        />
      )}
      {/*
       * To a colony
       */}
      {from && colony && (
        <FormattedMessage
          {...MSG.toText}
          values={{
            recipientString: (
              <ColonyDetails
                address={from}
                colony={colony}
                showMaskedAddress={showMaskedAddress}
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
      {!from && colony && (
        <FormattedMessage
          {...MSG.fromText}
          values={{
            senderString: (
              <ColonyDetails
                address={from}
                colony={colony}
                showMaskedAddress={showMaskedAddress}
              />
            ),
          }}
        />
      )}
    </p>
  </div>
);

const TransactionDetails = ({
  showMaskedAddress = true,
  task,
  transaction: { incoming, colonyAddress },
  transaction,
  user,
}: Props) => {
  const { data: colony } = useDataFetcher<ColonyType>(
    colonyFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const TransactionComponent = incoming
    ? IncomingTransaction
    : OutgoingTransaction;
  return (
    <TransactionComponent
      colony={colony}
      showMaskedAddress={showMaskedAddress}
      task={task}
      transaction={transaction}
      user={user}
    />
  );
};

TransactionDetails.displayName = displayName;

export default TransactionDetails;
