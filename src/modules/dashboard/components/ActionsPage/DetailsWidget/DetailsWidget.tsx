import React, { ReactElement } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import Icon from '~core/Icon';
import DetailsWidgetUser from '~core/DetailsWidgetUser';
import TransactionLink from '~core/TransactionLink';

import { AnyUser } from '~data/index';
import { ColonyActions } from '~types/index';
import { EventValues } from '../../ActionsPageFeed/ActionsPageFeed';
import { splitTransactionHash } from '~utils/strings';

import DetailsWidgetTeam from './DetailsWidgetTeam';

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
  actionTypesTitles: {
    id: 'dashboard.ActionsPage.DetailsWidget.actionTypesTitles',
    defaultMessage: `{actionType, select,
      payment {Payment}
      recovery {Recovery Mode}
      moveFunds {Move Funds}
      other {Generic Action}
    }`,
  },
});

interface Props {
  actionType: ColonyActions;
  recipient?: AnyUser;
  values?: EventValues;
  transactionHash?: string;
}

const ACTION_TYPES_ICONS_MAP: { [key in ColonyActions]: string } = {
  [ColonyActions.Payment]: 'emoji-dollar-stack',
  [ColonyActions.Recovery]: 'emoji-alarm-lamp',
  [ColonyActions.MoveFunds]: 'emoji-world-globe',
  [ColonyActions.Generic]: 'circle-check-primary',
};

const DetailsWidget = ({
  actionType = ColonyActions.Generic,
  recipient,
  values,
  transactionHash,
}: Props) => {
  const { formatMessage } = useIntl();

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
   */
  const Amount = () => values?.amount as ReactElement;
  const Symbol = () => values?.tokenSymbol as ReactElement;

  return (
    <div>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.actionType} />
        </div>
        <div className={styles.value}>
          <Icon
            title={formatMessage(MSG.actionTypesTitles, {
              actionType: values?.actionType,
            })}
            appearance={{ size: 'small' }}
            name={ACTION_TYPES_ICONS_MAP[actionType]}
          />
          <FormattedMessage
            {...MSG.actionTypesTitles}
            /*
             * @NOTE We need to use the action type value that was converted to
             * camelCase since ReactIntl doesn't like keys that are composed
             * of two separate strings (apparently you can't pass it just a plain
             * string with spaces...)
             */
            values={{ actionType: values?.actionType }}
          />
        </div>
      </div>
      {values?.fromDomain && showFullDetails && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.fromDomain} />
          </div>
          <div className={styles.value}>
            <DetailsWidgetTeam domain={values.fromDomain} />
          </div>
        </div>
      )}
      {(values?.toDomain || recipient) && showFullDetails && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.toRecipient} />
          </div>
          <div className={styles.value}>
            {values?.toDomain ? (
              <DetailsWidgetTeam domain={values.toDomain} />
            ) : (
              <DetailsWidgetUser
                walletAddress={recipient?.profile.walletAddress as string}
              />
            )}
          </div>
        </div>
      )}
      {values?.amount && showFullDetails && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.value} />
          </div>
          <div className={styles.value}>
            <Amount /> <Symbol />
          </div>
        </div>
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
