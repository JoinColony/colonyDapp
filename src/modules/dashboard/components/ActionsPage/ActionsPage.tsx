import React, { useEffect, useMemo } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ColonyRole } from '@colony/colony-js';
import Heading from '~core/Heading';
import TextDecorator from '~lib/TextDecorator';
import UserMention from '~core/UserMention';
import LoadingTemplate from '~pages/LoadingTemplate';
import Button from '~core/Button';
import CopyableAddress from '~core/CopyableAddress';
import ActionsPageFeed, {
  ActionsPageFeedItem,
} from '~dashboard/ActionsPageFeed';
import ActionsPageComment from '~dashboard/ActionsPageComment';
import MultisigWidget from './MultisigWidget';
import DetailsWidget, {
  DetailsWidgetUser,
  DetailsWidgetTeam,
} from './DetailsWidget';
import TransactionHash, { Hash } from './TransactionHash';

import NakedMoleImage from '../../../../img/naked-mole.svg';

import {
  useTransactionLazyQuery,
  useUserLazyQuery,
  useColonyFromNameQuery,
  useUser,
  useLoggedInUser,
} from '~data/index';
import { isTransactionFormat } from '~utils/web3';
import { STATUS, ColonyActionTypes } from './types';
import { NOT_FOUND_ROUTE } from '~routes/index';

import styles from './ActionsPage.css';

const MSG = defineMessages({
  actionTitle: {
    id: 'dashboard.ActionsPage.actionTitle',
    defaultMessage: `{name, select,
      false {Unknown Transaction}
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
  transactionNotFound: {
    id: 'dashboard.ActionsPage.transactionNotFound',
    defaultMessage: `Ooops, transaction not found`,
  },
  returnToColony: {
    id: 'dashboard.ActionsPage.returnToColony',
    defaultMessage: `Return to colony`,
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

const STATUS_MAP = {
  0: STATUS.Failed,
  1: STATUS.Succeeded,
  2: STATUS.Pending,
};

const ActionsPage = () => {
  const { transactionHash, colonyName } = useParams<{
    transactionHash?: string;
    colonyName: string;
  }>();

  const { username: currentUserName, ethereal } = useLoggedInUser();

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

  const reverseENSAddress = dataVariables?.address;

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
      colonyData?.colony
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
    if (transactionData?.transaction?.from) {
      fetchUser({
        variables: { address: transactionData.transaction.from },
      });
    }
  }, [fetchUser, transactionData]);

  const fallbackUserData = useUser(transactionData?.transaction?.from || '');

  const { Decorate } = new TextDecorator({
    username: (usernameWithAtSign) => (
      <UserMention username={usernameWithAtSign.slice(1)} />
    ),
  });

  const titleDynamicValues = useMemo(
    () => ({
      user: (() => {
        /*
         * @NOTE Using a fallback profile allows us to display a user's address
         * if he doesn't have a colony profile yet
         */
        const {
          profile: { username, walletAddress },
        } = userData?.user || fallbackUserData;

        if (username && walletAddress) {
          return <Decorate key={walletAddress}>{`@${username}`}</Decorate>;
        }
        if (walletAddress) {
          return (
            /*
             * @NOTE This might not exist in the final title copy in this format
             * but most likely we'll have "some" iteration of this for which we'll
             * use this as base
             */
            <span className={styles.addressInTitle}>
              <CopyableAddress>{walletAddress}</CopyableAddress>
            </span>
          );
        }
        return false;
      })(),
      name: (() => {
        if (transactionData?.transaction?.events?.length) {
          const {
            events: [event],
          } = transactionData.transaction;
          /*
           * Display the first event as the page title
           * We might need to change this in the future
           */
          return event.name;
        }
        return false;
      })(),
    }),
    [transactionData, fallbackUserData, userData],
  );

  if (!isTransactionFormat(transactionHash) || transactionDataError) {
    return (
      <div className={styles.main}>
        <div className={styles.notFoundContainer}>
          <NakedMoleImage />
          <Heading
            text={MSG.transactionNotFound}
            appearance={{
              size: 'medium',
              weight: 'medium',
              theme: 'dark',
            }}
          />
          <Button
            title={MSG.returnToColony}
            text={MSG.returnToColony}
            linkTo={`/colony/${colonyName}`}
            appearance={{
              theme: 'primary',
              size: 'large',
            }}
          />
          <div className={styles.divider} />
          <div className={styles.hashWrapper}>
            <Hash transactionHash={transactionHash} />
          </div>
        </div>
      </div>
    );
  }

  if (
    transactionDataLoading ||
    userDataLoading ||
    !transactionData ||
    !colonyData
  ) {
    return <LoadingTemplate loadingText={MSG.loading} />;
  }

  if (
    !colonyName ||
    (reverseENSAddress as SuperSpecificColonyAddress) instanceof Error
  ) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  const {
    transaction: { hash, status, events, createdAt },
  } = transactionData;

  const {
    colony: { colonyAddress },
  } = colonyData;

  const {
    profile: { walletAddress },
  } = userData?.user || fallbackUserData;

  const detailsWidgetFrom = colonyAddress ? (
    <DetailsWidgetTeam domainId={2} colonyAddress={colonyAddress} />
  ) : null;

  const detailsWidgetTo = walletAddress ? (
    <DetailsWidgetUser walletAddress={walletAddress} />
  ) : null;

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/*
           * @NOTE Can't use `Heading` here since it uses `formmatedMessage` internally
           * for message descriptors, and that doesn't support our complex text values
           */}
          <h1 className={styles.heading}>
            <FormattedMessage
              {...MSG.actionTitle}
              values={titleDynamicValues}
            />
          </h1>
          {!events?.length && hash && (
            <TransactionHash
              transactionHash={hash}
              /*
               * @NOTE Otherwise it interprets 0 as false, rather then a index
               * Typecasting it doesn't work as well
               */
              status={typeof status === 'number' && STATUS_MAP[status]}
              createdAt={createdAt}
            />
          )}
          <ActionsPageFeedItem
            createdAt={Date.now()}
            walletAddress={walletAddress}
            annotation
            comment={`Luke has big plans and the rebellion needs
                    these funds. I had to ‘Force’ this, I just had to!`}
          />
          {transactionHash && (
            <>
              <ActionsPageFeed
                transactionHash={transactionHash}
                /*
                 * @NOTE If in the future they will not be needed on this page
                 * specifically, consider moving loading of the network events
                 * directly in the feed, that way, we can load it separately
                 * while still displaying something to the user
                 */
                networkEvents={events}
              />
              {/*
               *  @NOTE A user can comment only if he has a wallet connected
               * and a registered user profile
               */}
              {currentUserName && !ethereal && (
                <ActionsPageComment
                  transactionHash={transactionHash}
                  colonyAddress={colonyAddress}
                />
              )}
            </>
          )}
        </div>
        <div className={styles.details}>
          <MultisigWidget
            // Mocking for now
            membersAllowedForApproval={Array.from(
              Array(10),
              () => walletAddress,
            )}
            requiredNumber={4}
            requiredPermission={ColonyRole.Recovery}
          >
            <Button
              text={{ id: 'button.approve' }}
              appearance={{
                theme: 'primary',
                size: 'medium',
              }}
            />
          </MultisigWidget>
          <DetailsWidget
            domainId={1}
            actionType={ColonyActionTypes.PAYMENT}
            from={detailsWidgetFrom}
            to={detailWidgetTo}
            colonyAddress={colonyData?.colony?.colonyAddress}
          />
        </div>
      </div>
    </div>
  );
};

ActionsPage.displayName = displayName;

export default ActionsPage;
