import React, { useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import TransactionHash from './TransactionHash';
import TextDecorator from '~lib/TextDecorator';
import UserMention from '~core/UserMention';
import LoadingTemplate from '~pages/LoadingTemplate';

import {
  useTransactionLazyQuery,
  useUserLazyQuery,
  useColonyFromNameQuery,
} from '~data/index';
import { isTransactionFormat } from '~utils/web3';
import { STATUS } from './types';
import { NOT_FOUND_ROUTE } from '~routes/index';

import styles from './ActionsPage.css';

const MSG = defineMessages({
  genericAction: {
    id: 'dashboard.ActionsPage.genericAction',
    defaultMessage: `{name, select,
      false {Generic Action}
      other {{name}}
    } {user, select,
      false {}
      other {by {user}}
    }`,
  },
  loading: {
    id: 'dashboard.ActionsPage.loading',
    defaultMessage: `Loading Transaction`,
  },
});

/**
 * @NOTE On the specific colony address type
 *
 * This came about as a result of hooking into the result of the colony query,
 * on the client side query, before it sends the result on to the server query,
 * and act upon that if that's in an error state (in which case, it won't actually
 * reach the server)
 *
 * See the comment below, where we actually set the reverseENSAddress for a more
 * in depth explanation.
 */
type SuperSpecificColonyAddress = string | Error;

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
  const { transactionHash, colonyName } = useParams<{
    transactionHash?: string;
    colonyName: string;
  }>();

  const {
    data: colonyData,
    /**
     * @NOTE Hooking into the return variable value
     *
     * Since this is a client side query it's return value will never end up
     * in the final result from the main query hook, either the value or the
     * eventual error.
     *
     * For this we hook into the `address` value which will be set internally
     * by the `@client` query so that we can act on it if we encounter an ENS
     * error.
     *
     * Based on that error we can determine if the colony is registered or not.
     */
    variables: dataVariables,
  } = useColonyFromNameQuery({
    variables: { address: '', name: colonyName },
  });

  const reverseENSAddress = dataVariables && dataVariables.address;

  const [
    fetchTransction,
    {
      data: transactionData,
      loading: transactionDataLoading,
      error: transactionDataError,
    },
  ] = useTransactionLazyQuery();

  const [
    fetchUser,
    { data: userData, loading: userDataLoading },
  ] = useUserLazyQuery();

  useEffect(() => {
    if (
      transactionHash &&
      isTransactionFormat(transactionHash) &&
      colonyData &&
      colonyData.colony
    ) {
      fetchTransction({
        variables: {
          transactionHash,
          colonyAddress: colonyData.colony.colonyAddress,
        },
      });
    }
  }, [fetchTransction, transactionHash, colonyData]);

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

  if (!isTransactionFormat(transactionHash)) {
    return <div>Not a valid transaction</div>;
  }

  if (
    !colonyName ||
    (reverseENSAddress as SuperSpecificColonyAddress) instanceof Error ||
    transactionDataError
  ) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (transactionDataLoading || userDataLoading || !transactionData) {
    return <LoadingTemplate loadingText={MSG.loading} />;
  }

  const {
    transaction: { hash, status, event },
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
              name: event ? event.name : false,
            }}
            appearance={{
              size: 'medium',
              weight: 'medium',
              theme: 'dark',
            }}
          />
          {!event && hash && (
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
