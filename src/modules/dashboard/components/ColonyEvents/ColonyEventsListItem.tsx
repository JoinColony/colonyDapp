import React, { useMemo } from 'react';
import {
  FormattedDateParts,
  FormattedMessage,
  defineMessages,
  useIntl,
} from 'react-intl';
import Decimal from 'decimal.js';

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
import { useUser, Colony } from '~data/index';
import { createAddress } from '~utils/web3';
import { FormattedEvent, ColonyAndExtensionsEvents } from '~types/index';
import { getRoleEventDescriptorsIds } from '~utils/colonyActions';

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

  const token = tokens.find(({ address }) => address === tokenAddress);
  const colonyNativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );

  const getEventListTitleMessageDescriptor = useMemo(() => {
    return eventName === ColonyAndExtensionsEvents.ColonyRoleSet ||
      eventName === ColonyAndExtensionsEvents.RecoveryRoleSet
      ? getRoleEventDescriptorsIds(setTo, eventName)
      : 'eventList.event';
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
      <span className={styles.titleDecoration}>
        <FriendlyName user={agentUserProfile} autoShrinkAddress />
      </span>
    ),
    recipient: (
      <span className={styles.titleDecoration}>
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
        unit={getTokenDecimalsWithFallback(decimals || token?.decimals)}
      />
    ),
    tokenSymbol: token?.symbol || colonyNativeToken?.symbol,
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
    reputationChange: `${getFormattedTokenValue(
      new Decimal(amount || '0').mul(-1).toString(),
      decimals,
    )} pts`,
  };

  return (
    <li>
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
              size="s"
              address={agent}
              user={agentUserProfile}
              notSet={false}
              showInfo
              popperProps={{
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
            appearance={{ size: 'medium', theme: 'dark' }}
            placement="bottom-start"
            showArrow={false}
            content={
              <div className={styles.tooltip}>
                <FormattedMessage
                  id={getEventListTitleMessageDescriptor}
                  values={eventMessageValues}
                />
              </div>
            }
            popperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 5],
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
            {domain && (
              <span className={styles.domain}>
                {domain.name ? (
                  domain.name
                ) : (
                  <FormattedMessage
                    {...MSG.domain}
                    values={{ domainId: domain.id }}
                  />
                )}
              </span>
            )}
            {transactionHash && (
              <TransactionLink
                className={styles.blockscoutLink}
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
