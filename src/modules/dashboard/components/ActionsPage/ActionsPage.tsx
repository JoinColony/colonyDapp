import React, { useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import Heading from '~core/Heading';
import Button from '~core/Button';
import Numeral from '~core/Numeral';
import FriendlyName from '~core/FriendlyName';
import LoadingTemplate from '~pages/LoadingTemplate';
import ActionsPageFeed, {
  ActionsPageFeedItem,
} from '~dashboard/ActionsPageFeed';
import ActionsPageComment from '~dashboard/ActionsPageComment';
import InputStorageWidget from './InputStorageWidget';

import {
  useColonyActionLazyQuery,
  useUserLazyQuery,
  useColonyFromNameQuery,
  useUser,
  useLoggedInUser,
  useTokenInfoLazyQuery,
  OneDomain,
  useColonySingleDomainQuery,
} from '~data/index';
import { NOT_FOUND_ROUTE } from '~routes/index';
import { ColonyActions } from '~types/index';
import { isTransactionFormat } from '~utils/web3';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import MultisigWidget from './MultisigWidget';
import DetailsWidget from './DetailsWidget';
import TransactionHash, { Hash } from './TransactionHash';
import { STATUS_MAP } from './staticMaps';

import NakedMoleImage from '../../../../img/naked-mole.svg';
import styles from './ActionsPage.css';

const MSG = defineMessages({
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
  recoveryTag: {
    id: 'dashboard.ActionsPage.recovery',
    defaultMessage: `Recovery`,
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
      data: colonyActionData,
      loading: colonyActionLoading,
      error: colonyActionError,
    },
  ] = useColonyActionLazyQuery();

  const [
    fetchRecipientProfile,
    { data: recipientProfile, loading: repicientProfileLoading },
  ] = useUserLazyQuery();

  const [
    fetchInitiatorProfile,
    { data: initiatorProfile, loading: initiatorProfileLoading },
  ] = useUserLazyQuery();

  const [
    fetchTokenInfo,
    { data: tokenData, loading: loadingTokenData },
  ] = useTokenInfoLazyQuery();

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
    if (colonyActionData?.colonyAction) {
      const { recipient, actionInitiator } = colonyActionData?.colonyAction;
      fetchRecipientProfile({
        variables: {
          address: recipient,
        },
      });
      fetchInitiatorProfile({
        variables: {
          address: actionInitiator,
        },
      });
    }
  }, [fetchRecipientProfile, fetchInitiatorProfile, colonyActionData]);

  useEffect(() => {
    if (colonyActionData?.colonyAction?.tokenAddress) {
      const { tokenAddress } = colonyActionData?.colonyAction;
      fetchTokenInfo({ variables: { address: tokenAddress } });
    }
  }, [fetchTokenInfo, colonyActionData]);

  const fallbackRecipientProfile = useUser(
    colonyActionData?.colonyAction?.recipient || '',
  );

  const fallbackInitiatorProfile = useUser(
    colonyActionData?.colonyAction?.actionInitiator || '',
  );

  /*
   * There's a weird edge case where Apollo's caches screws with us and doesn't
   * fetch the latest domain (maybe network lag?)
   *
   * So we fetch the known existent domain manually and set it as a fallback
   *
   * This way the actions page will always be able to display a domain
   */
  const {
    data: fallbackFromDomain,
    loading: loadingFallbackFromDomain,
  } = useColonySingleDomainQuery({
    variables: {
      colonyAddress: colonyData?.colony.colonyAddress.toLowerCase() || '',
      domainId: colonyActionData?.colonyAction?.fromDomain || 0,
    },
  });
  const {
    data: fallbackToDomain,
    loading: loadingFallbackToDomain,
  } = useColonySingleDomainQuery({
    variables: {
      colonyAddress: colonyData?.colony.colonyAddress.toLowerCase() || '',
      domainId: colonyActionData?.colonyAction?.toDomain || 0,
    },
  });

  if (!isTransactionFormat(transactionHash) || colonyActionError) {
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
    colonyActionLoading ||
    repicientProfileLoading ||
    initiatorProfileLoading ||
    loadingTokenData ||
    loadingFallbackFromDomain ||
    loadingFallbackToDomain ||
    !colonyActionData ||
    !colonyData ||
    !tokenData
  ) {
    return <LoadingTemplate loadingText={MSG.loading} />;
  }

  if (
    !colonyName ||
    (reverseENSAddress as SuperSpecificColonyAddress) instanceof Error
  ) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  /*
   * Colony Action
   */

  const {
    colonyAction: {
      hash,
      status,
      events,
      createdAt,
      actionType,
      amount,
      fromDomain,
      toDomain,
      annotationHash,
    },
  } = colonyActionData;

  /*
   * Colony
   */
  const {
    colony: { colonyAddress, domains },
  } = colonyData;

  /*
   * Users, both initiator and recipient
   */
  const recipientProfileWithFallback =
    recipientProfile?.user || fallbackRecipientProfile;
  const initiatorProfileWithFallback =
    initiatorProfile?.user || fallbackInitiatorProfile;
  const {
    profile: { walletAddress: initiatorWalletAddress },
  } = initiatorProfileWithFallback;

  /*
   * Token
   */
  const {
    tokenInfo: { decimals, symbol },
  } = tokenData;

  /*
   * @NOTE We need to convert the action type name into a forced camel-case string
   *
   * This is because it might have a name that contains spaces, and ReactIntl really
   * doesn't like that...
   */
  const actionAndEventValues = {
    actionType,
    initiator: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={initiatorProfileWithFallback} autoShrinkAddress />
      </span>
    ),
    recipient: (
      <span className={styles.titleDecoration}>
        <FriendlyName
          user={recipientProfileWithFallback}
          autoShrinkAddress
          colony={colonyData?.colony}
        />
      </span>
    ),
    amount: (
      <Numeral value={amount} unit={getTokenDecimalsWithFallback(decimals)} />
    ),
    tokenSymbol: <span>{symbol || '???'}</span>,
    decimals: getTokenDecimalsWithFallback(decimals),
    fromDomain:
      (domains.find(
        ({ ethDomainId }) => ethDomainId === fromDomain,
      ) as OneDomain) || fallbackFromDomain?.colonyDomain,
    toDomain:
      (domains.find(
        ({ ethDomainId }) => ethDomainId === toDomain,
      ) as OneDomain) || fallbackToDomain?.colonyDomain,
  };

  return (
    <div className={styles.main}>
      {actionType === ColonyActions.Recovery && (
        <div className={styles.container}>
          <p className={styles.recoveryTag}>
            <FormattedMessage {...MSG.recoveryTag} />
          </p>
        </div>
      )}
      <hr className={styles.dividerTop} />
      <div className={styles.container}>
        <div className={styles.content}>
          {/*
           * @NOTE Can't use `Heading` here since it uses `formmatedMessage` internally
           * for message descriptors, and that doesn't support our complex text values
           */}
          <h1 className={styles.heading}>
            <FormattedMessage
              id="action.title"
              values={{
                ...actionAndEventValues,
                fromDomain: actionAndEventValues.fromDomain?.name,
                toDomain: actionAndEventValues.toDomain?.name,
              }}
            />
          </h1>
          {!events?.length && hash && (
            <TransactionHash
              transactionHash={hash}
              /*
               * @NOTE Otherwise it interprets 0 as false, rather then a index
               * Typecasting it doesn't work as well
               */
              status={
                typeof status === 'number' ? STATUS_MAP[status] : undefined
              }
              createdAt={createdAt}
            />
          )}
          {actionType !== ColonyActions.Generic && annotationHash && (
            <ActionsPageFeedItem
              createdAt={createdAt}
              user={initiatorProfileWithFallback}
              annotation
              comment={annotationHash}
            />
          )}
          <ActionsPageFeed
            actionType={actionType}
            transactionHash={transactionHash as string}
            networkEvents={events}
            values={actionAndEventValues}
          />
          {/*
           *  @NOTE A user can comment only if he has a wallet connected
           * and a registered user profile
           */}
          {currentUserName && !ethereal && (
            <ActionsPageComment
              transactionHash={transactionHash as string}
              colonyAddress={colonyAddress}
            />
          )}
        </div>
        <div className={styles.details}>
          {actionType === ColonyActions.Recovery ? (
            <>
              <InputStorageWidget />
              <MultisigWidget
                // Mocking for now
                membersAllowedForApproval={Array.from(
                  Array(10),
                  () => initiatorWalletAddress,
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
            </>
          ) : (
            <DetailsWidget
              actionType={actionType as ColonyActions}
              recipient={recipientProfileWithFallback}
              transactionHash={transactionHash}
              values={actionAndEventValues}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ActionsPage.displayName = displayName;

export default ActionsPage;
