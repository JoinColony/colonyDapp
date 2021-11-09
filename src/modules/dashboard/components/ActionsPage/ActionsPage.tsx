import React, { useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';
import LoadingTemplate from '~pages/LoadingTemplate';

import {
  DefaultAction,
  RecoveryAction,
  DefaultMotion,
} from './ActionsComponents';

import {
  useColonyActionLazyQuery,
  useUserLazyQuery,
  useColonyFromNameQuery,
  useUser,
  useTokenInfoLazyQuery,
} from '~data/index';
import { NOT_FOUND_ROUTE } from '~routes/index';
import { ColonyActions, ColonyMotions } from '~types/index';
import { isTransactionFormat } from '~utils/web3';

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
    defaultMessage: `Ooops, action not found`,
  },
  returnToColony: {
    id: 'dashboard.ActionsPage.returnToColony',
    defaultMessage: `Return to colony`,
  },
  unknownTransaction: {
    id: 'dashboard.ActionsPage.unknownTransaction',
    defaultMessage: `Unknown Transaction`,
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
    fetchTransaction,
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
      colonyData?.processedColony
    ) {
      fetchTransaction({
        variables: {
          transactionHash,
          colonyAddress: colonyData.processedColony.colonyAddress,
        },
      });
    }
  }, [fetchTransaction, transactionHash, colonyData]);

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
   * Users, both initiator and recipient
   */
  const recipientProfileWithFallback =
    recipientProfile?.user || fallbackRecipientProfile;
  const initiatorProfileWithFallback =
    initiatorProfile?.user || fallbackInitiatorProfile;

  const {
    actionType,
    events,
    hash,
    createdAt,
    status,
  } = colonyActionData?.colonyAction;

  if (!events?.length && hash) {
    return (
      <div className={styles.main}>
        <hr className={styles.dividerTop} />
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.heading}>
              <FormattedMessage {...MSG.unknownTransaction} />
            </h1>
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
          </div>
        </div>
      </div>
    );
  }

  switch (actionType) {
    /*
     * @TODO Add cases for all actions that require a specific component
     */
    case ColonyActions.Recovery:
      return (
        <RecoveryAction
          colony={colonyData?.processedColony}
          token={tokenData?.tokenInfo}
          colonyAction={colonyActionData?.colonyAction}
          transactionHash={transactionHash as string}
          recipient={recipientProfileWithFallback}
          initiator={initiatorProfileWithFallback}
        />
      );
    case ColonyMotions.PaymentMotion:
    case ColonyMotions.ColonyEditMotion:
    case ColonyMotions.MoveFundsMotion:
    case ColonyMotions.SetUserRolesMotion:
    case ColonyMotions.CreateDomainMotion:
    case ColonyMotions.EditDomainMotion:
    case ColonyMotions.MintTokensMotion:
    case ColonyMotions.VersionUpgradeMotion:
    case ColonyMotions.EmitDomainReputationPenaltyMotion:
    case ColonyMotions.EmitDomainReputationRewardMotion:
      return (
        <DefaultMotion
          colony={colonyData?.processedColony}
          token={tokenData?.tokenInfo}
          colonyAction={colonyActionData?.colonyAction}
          transactionHash={transactionHash as string}
          recipient={recipientProfileWithFallback}
          initiator={initiatorProfileWithFallback}
        />
      );
    case ColonyActions.Generic:
    default:
      return (
        <DefaultAction
          colony={colonyData?.processedColony}
          token={tokenData?.tokenInfo}
          colonyAction={colonyActionData?.colonyAction}
          transactionHash={transactionHash as string}
          recipient={recipientProfileWithFallback}
          initiator={initiatorProfileWithFallback}
        />
      );
  }
};

ActionsPage.displayName = displayName;

export default ActionsPage;
