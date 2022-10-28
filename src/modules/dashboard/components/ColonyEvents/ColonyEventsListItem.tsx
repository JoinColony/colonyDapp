import React, { useMemo, useEffect } from 'react';
import {
  FormattedDateParts,
  FormattedMessage,
  defineMessages,
  useIntl,
} from 'react-intl';
import Decimal from 'decimal.js';
import { useMediaQuery } from 'react-responsive';

import HookedUserAvatar from '~users/HookedUserAvatar';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';

import Numeral from '~core/Numeral';
import FriendlyName from '~core/FriendlyName';
import { Tooltip } from '~core/Popover';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { removeValueUnits } from '~utils/css';
import {
  getTokenDecimalsWithFallback,
  getFormattedTokenValue,
} from '~utils/tokens';
import { useUser, Colony, useTokenInfoLazyQuery } from '~data/index';
import { createAddress } from '~utils/web3';
import { FormattedEvent, ColonyAndExtensionsEvents } from '~types/index';
import { getAssignmentEventDescriptorsIds } from '~utils/colonyActions';

import { query700 as query } from '~styles/queries.css';

import styles, {
  popoverWidth,
  popoverDistance,
} from './ColonyEventsListItem.css';
import TransactionLink from '~core/TransactionLink';

const displayName = 'dashboard.ColonyEvents.ColonyEventsListItem';

const UserAvatar = HookedUserAvatar();
const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

const MSG = defineMessages({
  domain: {
    id: 'dashboard.ColonyEvents.ColonyEventsListItem.domain',
    defaultMessage: 'Domain {domainId}',
  },
  voteSide: {
    id: 'dashboard.ColonyEvents.ColonyEventsListItem.voteSide',
    defaultMessage: `{vote, select,
      0 {objected}
      1 {staked}
      other {supported}
    }`,
  },
  blockExplorer: {
    id: 'dashboard.ColonyEvents.ColonyEventsListItem.blockExplorer',
    defaultMessage: '{blockExplorerName}',
  },
});

interface Props {
  item: FormattedEvent;
  colony: Colony;
}

const ColonyEventsListItem = ({
  item: {
    eventName,
    agent,
    recipient,
    colonyAddress,
    amount,
    decimals,
    transactionHash,
    domainId,
    newDomainId,
    createdAt,
    displayValues,
    fundingPot,
    metadata,
    tokenAddress,
    paymentId,
    role,
    setTo,
    extensionHash,
    extensionVersion,
    oldVersion,
    newVersion,
    storageSlot,
    storageSlotValue,
    motionId,
    vote,
  },
  colony: { tokens, nativeTokenAddress },
  colony,
}: Props) => {
  const { formatMessage } = useIntl();

  const agentUserProfile = useUser(agent ? createAddress(agent) : '');

  const recipientProfile = useUser(
    recipient === colony.colonyAddress ? '' : createAddress(recipient),
  );

  const domain = colony.domains.find(
    ({ ethDomainId }) => ethDomainId === parseInt(domainId, 10),
  );
  const newDomain = colony.domains.find(
    ({ ethDomainId }) => ethDomainId === parseInt(newDomainId, 10),
  );

  const colonyNativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const [fetchTokenInfo, { data: tokenData }] = useTokenInfoLazyQuery();

  useEffect(() => {
    if (tokenAddress) {
      fetchTokenInfo({ variables: { address: tokenAddress } });
    }
  }, [fetchTokenInfo, tokenAddress]);

  const tokenDecimals =
    tokenData?.tokenInfo?.decimals || colonyNativeToken?.decimals;
  const symbol = tokenData?.tokenInfo?.symbol || colonyNativeToken?.symbol;
  const formattedReputationChange = getFormattedTokenValue(
    new Decimal(amount || '0').abs().toString(),
    decimals,
  );
  const getEventListTitleMessageDescriptor = useMemo(() => {
    if (
      eventName === ColonyAndExtensionsEvents.ColonyRoleSet ||
      eventName === ColonyAndExtensionsEvents.RecoveryRoleSet
    ) {
      return getAssignmentEventDescriptorsIds(setTo, eventName);
    }

    if (eventName === ColonyAndExtensionsEvents.ArbitraryReputationUpdate) {
      return `eventList.${eventName}.title`;
    }
    return 'eventList.event';
  }, [eventName, setTo]);

  const roleNameMessage = { id: `role.${role}` };
  const getFormattedRole = () => formatMessage(roleNameMessage).toLowerCase();

  const popoverPlacement = useMemo(() => {
    const offsetSkid = (-1 * removeValueUnits(popoverWidth)) / 2;
    return [offsetSkid, removeValueUnits(popoverDistance)];
  }, []);

  const eventMessageValues = {
    eventName,
    agent: (
      <span
        className={
          agentUserProfile.profile.username
            ? styles.titleDecorationUsername
            : styles.titleDecoration
        }
      >
        <FriendlyName user={agentUserProfile} autoShrinkAddress />
      </span>
    ),
    recipient: (
      <span
        className={
          recipientProfile.profile.username
            ? styles.titleDecorationUsername
            : styles.titleDecoration
        }
      >
        <FriendlyName
          user={recipientProfile}
          autoShrinkAddress
          colony={colony}
        />
      </span>
    ),
    amount: (
      <Numeral
        value={amount}
        unit={getTokenDecimalsWithFallback(
          tokenDecimals || colonyNativeToken?.decimals,
        )}
      />
    ),
    tokenSymbol: symbol || colonyNativeToken?.symbol,
    domain: domain?.name || '',
    newDomain: newDomain?.name || '',
    transactionHash,
    fundingPot,
    metadata,
    tokenAddress,
    paymentId,
    displayValues,
    role: role ? getFormattedRole() : '',
    extensionHash,
    extensionVersion,
    oldVersion,
    newVersion,
    storageSlot,
    storageSlotValue,
    motionId,
    voteSide: <FormattedMessage {...MSG.voteSide} values={{ vote }} />,
    reputationChange: formattedReputationChange,
    reputationChangeNumeral: <Numeral value={formattedReputationChange} />,
    isSmiteAction: new Decimal(amount).isNegative(),
  };

  const isMobile = useMediaQuery({ query });

  return (
    <li className={styles.listItem}>
      <div
        /*
         * @NOTE This is non-interactive element to appease the DOM Nesting Validator
         *
         * We're using a lot of nested components here, which themselves render interactive
         * elements.
         * So if this were say... a button, it would try to render a button under a button
         * and the validator would just yell at us some more.
         *
         * The other way to solve this, would be to make this list a table, and have the
         * click handler on the table row.
         * That isn't a option for us since I couldn't make the text ellipsis
         * behave nicely (ie: work) while using our core <Table /> components
         */
        role="button"
        tabIndex={0}
        className={styles.main}
      >
        <div className={styles.avatar}>
          {agent && (
            <UserAvatar
              colony={colony}
              size="s"
              address={agent}
              user={agentUserProfile}
              notSet={false}
              showInfo
              popperOptions={{
                showArrow: false,
                placement: 'bottom',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: popoverPlacement,
                    },
                  },
                ],
              }}
            />
          )}
          {colonyAddress && !agent && (
            <ColonyAvatar size="s" colonyAddress={colonyAddress} />
          )}
        </div>
        <div className={styles.content}>
          <Tooltip
            placement="bottom-start"
            content={
              <div>
                <FormattedMessage
                  id={getEventListTitleMessageDescriptor}
                  values={eventMessageValues}
                />
              </div>
            }
            popperOptions={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: isMobile ? [-45, 5] : [0, 5],
                  },
                },
              ],
            }}
          >
            <div className={styles.title}>
              <FormattedMessage
                id={getEventListTitleMessageDescriptor}
                values={eventMessageValues}
              />
            </div>
          </Tooltip>
          <div className={styles.meta}>
            <FormattedDateParts value={createdAt} month="short" day="numeric">
              {(parts) => (
                <>
                  <span className={styles.day}>{parts[2].value}</span>
                  <span>{parts[0].value}</span>
                </>
              )}
            </FormattedDateParts>
            {transactionHash && (
              <TransactionLink
                className={styles.blockExplorerLink}
                hash={transactionHash}
                text={MSG.blockExplorer}
                textValues={{
                  blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

ColonyEventsListItem.displayName = displayName;

export default ColonyEventsListItem;
