import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Decimal from 'decimal.js';
import { useMediaQuery } from 'react-responsive';

import Tag, { Appearance as TagAppareance } from '~core/Tag';
import FriendlyName from '~core/FriendlyName';
import { EventValue } from '~data/resolvers/colonyActions';
import { parseDomainMetadata } from '~utils/colonyActions';
import Numeral from '~core/Numeral';
import { useTitle } from '~utils/hooks/useTitle';

import ActionsPageFeed, {
  ActionsPageFeedItemWithIPFS,
} from '~dashboard/ActionsPageFeed';
import ColonyHomeInfo from '~dashboard/ColonyHome/ColonyHomeInfo';
import { CommentInput } from '~core/Comment';
import MaskedAddress from '~core/MaskedAddress';

import {
  useLoggedInUser,
  OneDomain,
  useColonySingleDomainQuery,
  Colony,
  ColonyActionQuery,
  TokenInfoQuery,
  AnyUser,
  SafeTransaction,
} from '~data/index';
import { ColonyActions, ColonyAndExtensionsEvents } from '~types/index';
import { useFormatRolesTitle } from '~utils/hooks/useFormatRolesTitle';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import {
  useColonyMetadataChecks,
  useExtendedColonyActionType,
} from '~modules/dashboard/hooks';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import { useDataFetcher } from '~utils/hooks';
import { MotionState, MOTION_TAG_MAP } from '~utils/colonyMotions';
import { SAFE_NAMES_MAP } from '~constants';

import { ipfsDataFetcher } from '../../../../core/fetchers';

import DetailsWidget from '../DetailsWidget';
import { unknownContractMSG } from '../DetailsWidget/DetailsWidgetSafeTransaction';

import { query700 as query } from '~styles/queries.css';
import styles from './DefaultAction.css';

const displayName = 'dashboard.ActionsPage.DefaultAction';

interface Props {
  colony: Colony;
  colonyAction: ColonyActionQuery['colonyAction'];
  token: TokenInfoQuery['tokenInfo'];
  transactionHash: string;
  recipient: AnyUser;
  initiator: AnyUser;
}

const DefaultAction = ({
  colony,
  colony: { colonyAddress, domains, safes },
  token,
  token: { decimals, symbol },
  colonyAction: {
    events = [],
    createdAt,
    actionType,
    amount,
    fromDomain,
    toDomain,
    annotationHash,
    annotationMessage,
    newVersion,
    oldVersion,
    colonyDisplayName,
    roles,
    reputationChange,
    transactionsTitle,
    safeTransactions,
    safeData,
  },
  colonyAction,
  transactionHash,
  recipient,
  initiator,
}: Props) => {
  const { formatMessage } = useIntl();
  const { username: currentUserName, ethereal } = useLoggedInUser();

  const { isVotingExtensionEnabled } = useEnabledExtensions({ colonyAddress });

  const { roleMessageDescriptorId, roleTitle } = useFormatRolesTitle(
    roles,
    actionType,
  );

  const metadataEvent = events.find(
    (event) =>
      event.name === ColonyAndExtensionsEvents.DomainMetadata ||
      event.name === ColonyAndExtensionsEvents.ColonyMetadata,
  );
  const values = (metadataEvent?.values as unknown) as EventValue;

  const { data: metadataJSON } = useDataFetcher(
    ipfsDataFetcher,
    [values?.metadata],
    [values?.metadata],
  );

  let domainMetadata;
  const {
    verifiedAddressesChanged,
    tokensChanged,
    removedSafes,
    addedSafe,
  } = useColonyMetadataChecks(
    actionType,
    colony,
    transactionHash,
    colonyAction,
  );

  const extendedActionType = useExtendedColonyActionType(
    actionType,
    colony,
    transactionHash,
    colonyAction,
  );

  if (metadataJSON && actionType === ColonyActions.EditDomain) {
    const { domainName, domainColor, domainPurpose } = parseDomainMetadata(
      metadataJSON,
    );
    domainMetadata = {
      name: domainName,
      color: domainColor,
      description: domainPurpose,
      ethDomainId: fromDomain,
    };
  }
  /*
   * There's a weird edge case where Apollo's caches screws with us and doesn't
   * fetch the latest domain (maybe network lag?)
   *
   * So we fetch the known existent domain manually and set it as a fallback
   *
   * This way the actions page will always be able to display a domain
   */
  const { data: fallbackFromDomain } = useColonySingleDomainQuery({
    variables: {
      colonyAddress: colonyAddress.toLowerCase() || '',
      domainId: fromDomain || 0,
    },
  });
  const { data: fallbackToDomain } = useColonySingleDomainQuery({
    variables: {
      colonyAddress: colonyAddress.toLowerCase() || '',
      domainId: toDomain || 0,
    },
  });

  const decimalAmount = getFormattedTokenValue(amount, decimals);
  const formattedReputationChange = getFormattedTokenValue(
    new Decimal(reputationChange).abs().toString(),
    decimals,
  );

  const removedSafesString = removedSafes?.reduce(
    (acc, { chainId, contractAddress, safeName }, index) => {
      const removedSafe = (
        <>
          <span>{`${safeName} (${SAFE_NAMES_MAP[chainId]}) `}</span>
          <MaskedAddress address={contractAddress} />
        </>
      );
      if (index === 0) {
        return removedSafe;
      }
      if (index === removedSafes.length - 1) {
        return (
          <>
            {acc} and {removedSafe}
          </>
        );
      }
      return (
        <>
          {acc}, {removedSafe}
        </>
      );
    },
    <></>,
  );

  const firstSafeTransaction: SafeTransaction | undefined = safeTransactions[0];

  const safeTransactionSafe = safes.find(
    (safe) =>
      safe.contractAddress === safeData?.contractAddress &&
      safe.chainId === safeData.chainId,
  );

  /*
   * @NOTE We need to convert the action type name into a forced camel-case string
   *
   * This is because it might have a name that contains spaces, and ReactIntl really
   * doesn't like that...
   */
  const actionAndEventValues = {
    actionType: extendedActionType,
    initiator: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={initiator} autoShrinkAddress />
      </span>
    ),
    recipient: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={recipient} autoShrinkAddress colony={colony} />
      </span>
    ),
    amount: <Numeral value={decimalAmount} />,
    token,
    tokenSymbol: <span>{symbol || '???'}</span>,
    decimals: getTokenDecimalsWithFallback(decimals),
    fromDomain:
      domainMetadata ||
      (domains.find(
        ({ ethDomainId }) => ethDomainId === fromDomain,
      ) as OneDomain) ||
      fallbackFromDomain?.colonyDomain,
    toDomain:
      (domains.find(
        ({ ethDomainId }) => ethDomainId === toDomain,
      ) as OneDomain) || fallbackToDomain?.colonyDomain,
    newVersion,
    oldVersion,
    colonyName: (
      <FriendlyName
        colony={{
          ...colony,
          ...(colonyDisplayName ? { displayName: colonyDisplayName } : {}),
        }}
        autoShrinkAddress
      />
    ),
    roles,
    reputationChange: formattedReputationChange,
    reputationChangeNumeral: <Numeral value={formattedReputationChange} />,
    isSmiteAction: new Decimal(reputationChange).isNegative(),
    removedSafes,
    removedSafesString,
    addedSafeAddress: addedSafe && (
      <MaskedAddress address={addedSafe.contractAddress} />
    ),
    chainName: addedSafe && SAFE_NAMES_MAP[addedSafe.chainId],
    safeName: addedSafe?.safeName || (
      <span className={styles.user}>@{safeTransactionSafe?.safeName}</span>
    ),
    moduleAddress: addedSafe && (
      <MaskedAddress address={addedSafe.moduleContractAddress} />
    ),
    safeTransactionTitle: transactionsTitle,
    safeTransactions,
    /*
     * The following references to firstSafeTransaction are only used in the event that there's only one safe transaction.
     * Multiple transactions has its own message.
     */
    safeTransactionAmount: (
      <>
        <Numeral value={firstSafeTransaction?.amount || ''} />
        <span> {firstSafeTransaction?.tokenData?.symbol}</span>
      </>
    ),
    safeTransactionRecipient: (
      <span className={styles.user}>
        @{firstSafeTransaction?.recipient?.profile.username}
      </span>
    ),
    safeTransactionNftToken: (
      <span className={styles.user}>
        {firstSafeTransaction?.nftData?.name ||
          firstSafeTransaction?.nftData?.tokenName}
      </span>
    ),
    safeTransactionFunctionName: firstSafeTransaction?.contractFunction,
    safeTransactionContractName:
      firstSafeTransaction?.contract?.profile.displayName ||
      formatMessage(unknownContractMSG),
    safeTransactionAddress: (
      <MaskedAddress
        address={firstSafeTransaction?.recipient?.profile.walletAddress || ''}
      />
    ),
    safeTransactionSafe,
    // id will be filterValue if an address was manually entered into the picker
    isSafeTransactionRecipientUser: !(
      firstSafeTransaction?.recipient?.id === 'filterValue'
    ),
  };

  const actionAndEventValuesForDocumentTitle = {
    actionType: extendedActionType,
    initiator:
      initiator.profile?.displayName ??
      initiator.profile?.username ??
      initiator.profile?.walletAddress,
    recipient:
      recipient.profile?.displayName ??
      recipient.profile?.username ??
      recipient.profile?.walletAddress,
    amount: decimalAmount,
    tokenSymbol: symbol,
    newVersion,
    oldVersion,
    fromDomain: actionAndEventValues.fromDomain?.name,
    toDomain: actionAndEventValues.toDomain?.name,
    roles: roleTitle,
    reputationChange: actionAndEventValues.reputationChange,
    reputationChangeNumeral: actionAndEventValues.reputationChangeNumeral,
    chainName: addedSafe && SAFE_NAMES_MAP[addedSafe.chainId],
    safeTransactionTitle: transactionsTitle,
  };

  const motionStyles = MOTION_TAG_MAP[MotionState.Forced];

  useTitle(
    `${formatMessage(
      { id: roleMessageDescriptorId || 'action.title' },
      actionAndEventValuesForDocumentTitle,
    )} | Action | Colony - ${colony.displayName ?? colony.colonyName ?? ``}`,
  );

  const isMobile = useMediaQuery({ query });

  return (
    <div className={styles.main}>
      {isMobile && <ColonyHomeInfo colony={colony} showNavigation isMobile />}
      {isVotingExtensionEnabled && (
        <div className={styles.upperContainer}>
          <p className={styles.tagWrapper}>
            <Tag
              text={motionStyles.name}
              appearance={{
                theme: motionStyles.theme as TagAppareance['theme'],
                // eslint-disable-next-line max-len
                colorSchema: motionStyles.colorSchema as TagAppareance['colorSchema'],
              }}
            />
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
          <h1 className={styles.heading} data-test="actionHeading">
            <FormattedMessage
              id={
                (verifiedAddressesChanged &&
                  `action.${ColonyActions.ColonyEdit}.verifiedAddresses`) ||
                (tokensChanged &&
                  `action.${ColonyActions.ColonyEdit}.tokens`) ||
                roleMessageDescriptorId ||
                'action.title'
              }
              values={{
                ...actionAndEventValues,
                fromDomain: actionAndEventValues.fromDomain?.name,
                toDomain: actionAndEventValues.toDomain?.name,
                roles: roleTitle,
              }}
            />
          </h1>
          {actionType !== ColonyActions.Generic &&
            (annotationHash || annotationMessage) && (
              <ActionsPageFeedItemWithIPFS
                colony={colony}
                createdAt={createdAt}
                user={initiator}
                annotation
                comment={annotationMessage || undefined}
                hash={annotationHash || undefined}
              />
            )}
          <ActionsPageFeed
            actionType={actionType}
            transactionHash={transactionHash as string}
            networkEvents={events}
            values={actionAndEventValues}
            actionData={colonyAction}
            colony={colony}
          />
          {/*
           *  @NOTE A user can comment only if he has a wallet connected
           * and a registered user profile
           */}
          {currentUserName && !ethereal && (
            <div className={styles.commentBox}>
              <CommentInput
                transactionHash={transactionHash}
                colonyAddress={colonyAddress}
              />
            </div>
          )}
        </div>
        <div className={styles.details}>
          <DetailsWidget
            actionType={extendedActionType as ColonyActions}
            recipient={recipient}
            transactionHash={transactionHash}
            values={actionAndEventValues}
            colony={colony}
          />
        </div>
      </div>
    </div>
  );
};

DefaultAction.displayName = displayName;

export default DefaultAction;
