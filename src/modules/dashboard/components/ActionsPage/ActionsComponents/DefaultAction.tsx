import React from 'react';
import { FormattedMessage } from 'react-intl';

import Numeral from '~core/Numeral';
import FriendlyName from '~core/FriendlyName';
import Comment from '~core/Comment';
import { EventValue } from '~data/resolvers/colonyActions';
import { parseDomainMetadata } from '~utils/colonyActions';

import ActionsPageFeed from '~dashboard/ActionsPageFeed';
import CommentInput from '~core/CommentInput';

import {
  useLoggedInUser,
  OneDomain,
  useColonySingleDomainQuery,
  Colony,
  ColonyActionQuery,
  TokenInfoQuery,
  AnyUser,
} from '~data/index';
import { ColonyActions, ColonyAndExtensionsEvents } from '~types/index';
import { useFormatRolesTitle } from '~utils/hooks/useFormatRolesTitle';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useDataFetcher } from '~utils/hooks';
import { ipfsDataFetcher } from '../../../../core/fetchers';

import DetailsWidget from '../DetailsWidget';

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
  colony: { colonyAddress, domains },
  token: { decimals, symbol },
  colonyAction: {
    events = [],
    createdAt,
    actionType,
    amount,
    fromDomain,
    toDomain,
    annotationHash,
    newVersion,
    oldVersion,
    colonyDisplayName,
    roles,
  },
  colonyAction,
  transactionHash,
  recipient,
  initiator,
}: Props) => {
  const { username: currentUserName, ethereal } = useLoggedInUser();

  const { roleMessageDescriptorId, roleTitle } = useFormatRolesTitle(
    roles,
    actionType,
  );

  const domainMetadataEvent = events.find(
    (event) => event.name === ColonyAndExtensionsEvents.DomainMetadata,
  );
  const values = (domainMetadataEvent?.values as unknown) as EventValue;

  const { data: metadataJSON } = useDataFetcher(
    ipfsDataFetcher,
    [values?.metadata],
    [values?.metadata],
  );

  let domainMetadata;
  if (metadataJSON) {
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
        <FriendlyName user={initiator} autoShrinkAddress />
      </span>
    ),
    recipient: (
      <span className={styles.titleDecoration}>
        <FriendlyName user={recipient} autoShrinkAddress colony={colony} />
      </span>
    ),
    amount: (
      <Numeral value={amount} unit={getTokenDecimalsWithFallback(decimals)} />
    ),
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
  };

  return (
    <div className={styles.main}>
      <hr className={styles.dividerTop} />
      <div className={styles.container}>
        <div className={styles.content}>
          {/*
           * @NOTE Can't use `Heading` here since it uses `formmatedMessage` internally
           * for message descriptors, and that doesn't support our complex text values
           */}
          <h1 className={styles.heading}>
            <FormattedMessage
              id={roleMessageDescriptorId || 'action.title'}
              values={{
                ...actionAndEventValues,
                fromDomain: actionAndEventValues.fromDomain?.name,
                toDomain: actionAndEventValues.toDomain?.name,
                roles: roleTitle,
              }}
            />
          </h1>
          {actionType !== ColonyActions.Generic && annotationHash && (
            <Comment
              createdAt={createdAt}
              user={initiator}
              annotation
              comment={annotationHash}
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
            <CommentInput
              transactionHash={transactionHash}
              colonyAddress={colonyAddress}
            />
          )}
        </div>
        <div className={styles.details}>
          <DetailsWidget
            actionType={actionType as ColonyActions}
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
