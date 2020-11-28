import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import TransactionHash from './TransactionHash';
import TextDecorator from '~lib/TextDecorator';
import UserMention from '~core/UserMention';

import { useTransactionLazyQuery, useUserLazyQuery } from '~data/index';
import { isTransactionFormat } from '~utils/web3';
import { STATUS } from './types';

import styles from './ActionsPage.css';

const MSG = defineMessages({
  genericAction: {
    id: 'dashboard.ActionsPage.genericAction',
    defaultMessage: `Generic Action {user, select,
      false {}
      other {by {user}}
    }`,
  },
});

const displayName = 'dashboard.ActionsPage';

/*
 * @TODO We need a decent way of detecting pending transaction
 *
 * Currently we only get these two states back from the chanin, and even so
 * we only get it for post-byzantium forks
 *
 * I think there's a way of looking at the value of `blockNumber` but I need
 * to look into it further
 */
const STATUS_MAP = {
  0: STATUS.Failed,
  1: STATUS.Succeeded,
};

const ActionsPage = () => {
  const { transactionHash } = useParams<{
    transactionHash?: string;
  }>();

  const [
    fetchTransction,
    { data: transactionData },
  ] = useTransactionLazyQuery();

  const [fetchUser, { data: userData }] = useUserLazyQuery();

  useEffect(() => {
    if (transactionHash && isTransactionFormat(transactionHash)) {
      fetchTransction({
        variables: { transactionHash },
      });
    }
  }, [fetchTransction, transactionHash]);

  useEffect(() => {
    if (
      transactionData &&
      transactionData.transaction &&
      transactionData.transaction.from
    ) {
      fetchUser({
        variables: { address: transactionData.transaction.from },
      });
    }
  }, [fetchUser, transactionData]);

  const { Decorate } = new TextDecorator({
    username: (usernameWithAtSign) => (
      <UserMention username={usernameWithAtSign.slice(1)} />
    ),
  });

  if (!isTransactionFormat(transactionHash) || !transactionData) {
    return <div>Not a valid transaction</div>;
  }

  const {
    transaction: { hash, status },
  } = transactionData;

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Heading
            text={MSG.genericAction}
            textValues={{
              user: (() => {
                if (userData && userData.user && userData.user.profile) {
                  const { username, walletAddress } = userData.user.profile;
                  return (
                    <Decorate key={walletAddress}>{`@${username}`}</Decorate>
                  );
                }
                return false;
              })(),
            }}
            appearance={{
              size: 'medium',
              weight: 'medium',
              theme: 'dark',
            }}
          />
          {hash && (
            /*
             * @TODO This will only be shown if the transaction is not an "action"
             * So we'll need a way to determine that via events
             */
            <TransactionHash
              transactionHash={hash}
              status={status && STATUS_MAP[status]}
            />
          )}
        </div>
        <div className={styles.details}>
          {/*
           * @TODO Add in DEV-45
           */}
          Details component goes here
        </div>
      </div>
    </div>
  );
};

ActionsPage.displayName = displayName;

export default ActionsPage;
