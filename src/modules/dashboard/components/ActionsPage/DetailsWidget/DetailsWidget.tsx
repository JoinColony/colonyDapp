import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import Numeral from '~core/Numeral';
import Icon from '~core/Icon';
import DetailsWidgetUser from '~core/DetailsWidgetUser';
import TransactionLink from '~core/TransactionLink';

import { Colony, AnyUser } from '~data/index';
import { ColonyActions } from '~types/index';
import { PaymentDetails } from '../../ActionsPageFeed/ActionsPageFeed';

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
  from: {
    id: 'dashboard.ActionsPage.DetailsWidget.from',
    defaultMessage: 'From',
  },
  to: {
    id: 'dashboard.ActionsPage.DetailsWidget.to',
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
      Payment {Payment}
      Recovery {Recovery Mode}
      other {Generic Action}
    }`,
  },
});

interface Props {
  actionType: ColonyActions;
  recipient?: AnyUser;
  colony: Colony;
  payment?: PaymentDetails;
  transactionHash?: string;
}

const ACTION_TYPES_ICONS_MAP: { [key in ColonyActions]: string } = {
  [ColonyActions.Payment]: 'emoji-dollar-stack',
  [ColonyActions.Recovery]: 'emoji-alarm-lamp',
  [ColonyActions.Generic]: 'circle-check-primary',
};

const DetailsWidget = ({
  actionType = ColonyActions.Generic,
  recipient,
  colony,
  payment,
  transactionHash,
}: Props) => {
  const { formatMessage } = useIntl();

  const paymentDomain = useMemo(() => {
    if (payment?.fromDomain) {
      return colony?.domains?.find(
        ({ ethDomainId }) => ethDomainId === payment.fromDomain,
      );
    }
    return null;
  }, [colony, payment]);

  const showFullDetails = actionType !== ColonyActions.Generic;

  const shortenedHash = useMemo(() => {
    if (!showFullDetails && transactionHash) {
      const transactionStart = transactionHash.substring(0, 6);
      const transactionEnd = transactionHash.substring(
        transactionHash.length - 4,
      );
      return `${transactionStart}...${transactionEnd}`;
    }
    return undefined;
  }, [transactionHash, showFullDetails]);

  return (
    <div>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.actionType} />
        </div>
        <div className={styles.value}>
          <Icon
            title={formatMessage(MSG.actionTypesTitles, { actionType })}
            appearance={{ size: 'small' }}
            name={ACTION_TYPES_ICONS_MAP[actionType]}
          />
          <FormattedMessage
            {...MSG.actionTypesTitles}
            values={{ actionType }}
          />
        </div>
      </div>
      {paymentDomain && showFullDetails && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.from} />
          </div>
          <div className={styles.value}>
            <DetailsWidgetTeam domain={paymentDomain} />
          </div>
        </div>
      )}
      {recipient && showFullDetails && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.to} />
          </div>
          <div className={styles.value}>
            <DetailsWidgetUser
              walletAddress={recipient.profile.walletAddress}
            />
          </div>
        </div>
      )}
      {payment?.amount && showFullDetails && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.value} />
          </div>
          <div className={styles.value}>
            <Numeral
              value={payment.amount}
              /*
               * @NOTE We don't need to call `getTokenDecimalsWithFallback` since
               * we already did that when passing down the prop
               */
              unit={payment.decimals}
              suffix={` ${payment.symbol || '???'}`}
            />
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
