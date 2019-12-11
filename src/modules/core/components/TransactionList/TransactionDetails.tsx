import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ContractTransactionType, TaskType } from '~immutable/index';
import MaskedAddress from '~core/MaskedAddress';
import Link from '~core/Link';
import { Address, ENSName } from '~types/index';
import { User, AnyColony, useColonyQuery } from '~data/index';

import styles from './TransactionDetails.css';

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
    id: 'admin.TransactionList.TransactionDetails.untitled',
    defaultMessage: 'Untitled task',
  },
});

const displayName = 'admin.TransactionList.TransactionDetails';

interface Props {
  transaction: ContractTransactionType;
  task?: TaskType;
  user?: User;

  /*
   * User and colony addresses will always be shown; this controls whether the
   * address is shown in full, or masked.
   */
  showMaskedAddress?: boolean;
}

interface HookedProps extends Props {
  colony?: AnyColony;
}

const UserDetails = ({
  user,
  address,
  showMaskedAddress,
}: {
  address: Address;
  showMaskedAddress?: boolean;
  user?: User;
}) => {
  // @TODO consider user a proper preloader here
  if (!user) return null;
  const {
    profile: { displayName: userDisplayName, username },
  } = user;
  return (
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
};

const ColonyDetails = ({
  colony: { displayName: colonyDisplayName, colonyAddress },
  address = colonyAddress,
  showMaskedAddress,
}: {
  colony: AnyColony;
  address?: Address;
  showMaskedAddress?: boolean;
}) => (
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
  task: TaskType;
  colonyName: ENSName;
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
  transaction: { from, to },
  user,
}: HookedProps) => (
  <div>
    <p className={styles.primaryText}>
      {/*
       * From a user
       */}
      {from && !(to && colony) && user && (
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
  transaction: { from, to },
  user,
}: Props & {
  colony?: AnyColony;
}) => (
  <div>
    <p className={styles.primaryText}>
      {/*
       * To a user
       */}
      {to && !(from && colony) && user && (
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
  const { data } = useColonyQuery({ variables: { address: colonyAddress } });
  if (!data) return null;
  const TransactionComponent = incoming
    ? IncomingTransaction
    : OutgoingTransaction;
  return (
    <TransactionComponent
      colony={data.colony}
      showMaskedAddress={showMaskedAddress}
      task={task}
      transaction={transaction}
      user={user}
    />
  );
};

TransactionDetails.displayName = displayName;

export default TransactionDetails;
