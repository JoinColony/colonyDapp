import React, { ReactElement } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import Decimal from 'decimal.js';

import Icon from '~core/Icon';
import DetailsWidgetUser from '~core/DetailsWidgetUser';
import TransactionLink from '~core/TransactionLink';
import Numeral from '~core/Numeral';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { AnyUser, Colony, ColonySafe, SafeTransaction } from '~data/index';
import { AddedActions, ColonyActions, ColonyMotions } from '~types/index';
import { splitTransactionHash } from '~utils/strings';
import { getSafeTransactionActionMessageId } from '~utils/safes';
import { ExtendedActions, getDetailsForAction } from '~utils/colonyActions';
import { EventValues } from '../../ActionsPageFeed/ActionsPageFeed';
import { ACTION_TYPES_ICONS_MAP } from '../../ActionsPage/staticMaps';

import {
  DetailsWidgetTeam,
  DetailsWidgetAddSafe,
  DetailsWidgetRoles,
  DetailsWidgetSafe,
  DetailsWidgetSafeTransaction,
} from './index';
import styles from './DetailsWidget.css';

const displayName = 'dashboard.ActionsPage.DetailsWidget';

const MSG = defineMessages({
  activeTeam: {
    id: 'dashboard.ActionsPage.DetailsWidget.activeTeam',
    defaultMessage: 'Active team',
  },
  actionType: {
    id: 'dashboard.ActionsPage.DetailsWidget.actionType',
    defaultMessage: 'Action Type',
  },
  fromDomain: {
    id: 'dashboard.ActionsPage.DetailsWidget.fromDomain',
    defaultMessage: 'From',
  },
  motionDomain: {
    id: 'dashboard.ActionsPage.DetailsWidget.motionDomain',
    defaultMessage: 'Motion created in',
  },
  toRecipient: {
    id: 'dashboard.ActionsPage.DetailsWidget.toRecipient',
    defaultMessage: 'To',
  },
  value: {
    id: 'dashboard.ActionsPage.DetailsWidget.value',
    defaultMessage: 'Value',
  },
  transactionHash: {
    id: 'dashboard.ActionsPage.DetailsWidget.transactionHash',
    defaultMessage: 'Transaction Hash',
  },
  domain: {
    id: 'dashboard.ActionsPage.DetailsWidget.domain',
    defaultMessage: 'Team',
  },
  domainDescription: {
    id: 'dashboard.ActionsPage.DetailsWidget.domainDescription',
    defaultMessage: 'Team Purpose',
  },
  roles: {
    id: 'dashboard.ActionsPage.DetailsWidget.roles',
    defaultMessage: 'Roles',
  },
  colonyName: {
    id: 'dashboard.ActionsPage.DetailsWidget.colonyName',
    defaultMessage: 'Name',
  },
  reputationChange: {
    id: 'dashboard.ActionsPage.DetailsWidget.reputationChange',
    defaultMessage: `Reputation {isSmiteAction, select,
      true {penalty}
      false {reward}
    }`,
  },
  author: {
    id: 'dashboard.ActionsPage.DetailsWidget.colonyName',
    defaultMessage: 'Author',
  },
  safe: {
    id: 'dashboard.ActionsPage.DetailsWidget.safe',
    defaultMessage: 'Safe',
  },
  chain: {
    id: 'dashboard.ActionsPage.DetailsWidget.chain',
    defaultMessage: 'Chain',
  },
  safeAddress: {
    id: 'dashboard.ActionsPage.DetailsWidget.safeAddress',
    defaultMessage: 'Safe Address',
  },
  safeName: {
    id: 'dashboard.ActionsPage.DetailsWidget.safeName',
    defaultMessage: 'Safe Name',
  },
  contract: {
    id: 'dashboard.ActionsPage.DetailsWidget.contract',
    defaultMessage: 'Contract',
  },
});

export const { toRecipient: toRecipientMSG, value: valueMSG } = MSG;
export interface SafeInfo {
  safeTransactions: SafeTransaction[];
  safe: ColonySafe;
}

interface Props {
  actionType: ExtendedActions;
  recipient?: AnyUser;
  values?: EventValues;
  transactionHash?: string;
  colony: Colony;
}

const getMessageId = (
  actionType: ExtendedActions,
  safeTransactions?: SafeTransaction[] | null,
) => {
  if (ColonyMotions[actionType]) {
    return 'motion.type';
  }
  if (
    actionType === AddedActions.SafeTransactionInitiated &&
    safeTransactions
  ) {
    return getSafeTransactionActionMessageId(
      actionType,
      safeTransactions,
      'type',
    );
  }
  return 'action.type';
};
const DetailsWidget = ({
  actionType = ColonyActions.Generic,
  recipient,
  values,
  transactionHash,
  colony,
}: Props) => {
  const { formatMessage } = useIntl();
  const messageId = getMessageId(actionType, values?.safeTransactions);
  const showFullDetails = actionType !== ColonyActions.Generic;

  const splitHash = splitTransactionHash(transactionHash as string);
  let shortenedHash;
  if (splitHash && !showFullDetails) {
    const { header, start, end } = splitHash;
    shortenedHash = `${header}${start}...${end}`;
  }

  /*
   * @NOTE These were already being passed along as React Components, all we
   * are doing here is wrapping them in a function call so we can render them
   * Amount should have already been passed through <Numeral>
   */
  const Amount = () => values?.amount as ReactElement;
  const Symbol = () => values?.tokenSymbol as ReactElement;

  const detailsForAction = getDetailsForAction(actionType);
  const safeAdded =
    detailsForAction.Chain &&
    detailsForAction.SafeAddress &&
    detailsForAction.SafeName;

  return (
    <div>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.actionType} />
        </div>
        <div className={styles.value}>
          <Icon
            title={formatMessage(
              { id: messageId },
              {
                actionType,
              },
            )}
            appearance={{ size: 'small' }}
            name={ACTION_TYPES_ICONS_MAP[actionType]}
          />
          <div className={styles.text}>
            <FormattedMessage
              id={messageId}
              /*
               * @NOTE We need to use the action type value that was converted to
               * camelCase since ReactIntl doesn't like keys that are composed
               * of two separate strings (apparently you can't pass it just a plain
               * string with spaces...)
               */
              values={{
                actionType,
              }}
            />
          </div>
        </div>
      </div>
      {values?.motionDomain && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.motionDomain} />
          </div>
          <div className={styles.value}>
            <DetailsWidgetTeam domain={values.motionDomain} />
          </div>
        </div>
      )}
      {safeAdded && (
        <DetailsWidgetAddSafe
          addedSafe={{
            address: values?.addedSafeAddress,
            chainName: values?.chainName,
            safeName: values?.safeName as string,
            moduleAddress: values?.moduleAddress,
          }}
        />
      )}
      {detailsForAction.FromDomain && values?.fromDomain && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.fromDomain} />
          </div>
          <div className={styles.value}>
            <DetailsWidgetTeam domain={values.fromDomain} />
          </div>
        </div>
      )}
      {(detailsForAction.ToRecipient || detailsForAction.ToDomain) && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.toRecipient} />
          </div>
          <div className={styles.value}>
            {values?.toDomain && detailsForAction.ToDomain && (
              <DetailsWidgetTeam domain={values.toDomain} />
            )}
            {recipient && detailsForAction.ToRecipient && (
              <DetailsWidgetUser
                colony={colony}
                walletAddress={recipient?.profile.walletAddress as string}
              />
            )}
          </div>
        </div>
      )}
      {values?.amount && detailsForAction.Amount && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.value} />
          </div>
          <div className={styles.tokenContainer}>
            {values?.token && (
              <TokenIcon
                token={values.token}
                name={values.token.name || undefined}
                size="xxs"
              />
            )}
            <div className={styles.value}>
              <Amount /> <Symbol />
            </div>
          </div>
        </div>
      )}
      {detailsForAction.Domain && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.domain} />
          </div>
          <div className={styles.value}>
            {values?.fromDomain && (
              <DetailsWidgetTeam domain={values.fromDomain} />
            )}
          </div>
        </div>
      )}
      {detailsForAction.Author && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.author} />
          </div>
          <div className={styles.value}>
            {recipient && detailsForAction.Author && (
              <DetailsWidgetUser
                colony={colony}
                walletAddress={recipient?.profile.walletAddress}
              />
            )}
          </div>
        </div>
      )}
      {detailsForAction.ReputationChange && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage
              {...MSG.reputationChange}
              values={{ isSmiteAction: values?.isSmiteAction }}
            />
          </div>
          <div className={styles.value}>
            <Numeral value={values?.reputationChange || '0'} />{' '}
            {new Decimal(values?.reputationChange || '0').eq(1) ? 'pt' : 'pts'}
          </div>
        </div>
      )}
      {detailsForAction.Permissions && (
        <div className={styles.roleSettingItem}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.roles} />
          </div>
          <div className={styles.value}>
            {values?.roles && <DetailsWidgetRoles roles={values.roles} />}
          </div>
        </div>
      )}
      {detailsForAction.Description && values?.fromDomain?.description && (
        <div className={styles.domainDescriptionItem}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.domainDescription} />
          </div>
          <div className={styles.descriptionValue}>
            <div
              className={styles.domainDescription}
              title={values.fromDomain.description || ''}
            >
              {values.fromDomain.description}
            </div>
          </div>
        </div>
      )}
      {detailsForAction.Name && values?.colonyName && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.colonyName} />
          </div>
          <div className={styles.value}>{values.colonyName}</div>
        </div>
      )}
      {detailsForAction.Safe &&
        (values?.removedSafes || []).length > 0 &&
        values?.removedSafes?.map((safe, index) => (
          <div className={styles.item} key={index}>
            <div className={styles.label}>
              <FormattedMessage {...MSG.safe} />
            </div>
            <div className={styles.value}>
              <DetailsWidgetSafe safe={safe} />
            </div>
          </div>
        ))}
      {detailsForAction.SafeTransaction &&
        values?.safeTransactionSafe &&
        values?.safeTransactions && (
          <DetailsWidgetSafeTransaction
            safe={values.safeTransactionSafe}
            safeTransactions={values.safeTransactions}
            colony={colony}
          />
        )}
      {!!shortenedHash && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.transactionHash} />
          </div>
          <div className={styles.value}>
            <TransactionLink
              className={styles.transactionHashLink}
              hash={transactionHash as string}
              text={shortenedHash}
              title={transactionHash}
            />
          </div>
        </div>
      )}
    </div>
  );
};

DetailsWidget.displayName = displayName;

export default DetailsWidget;
