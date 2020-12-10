import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import ColorTag from '~core/ColorTag';
import Numeral from '~core/Numeral';
import Icon from '~core/Icon';
import DetailsWidgetUser from '~core/DetailsWidgetUser';

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
  activeDomainId?: number;
  actionType: ColonyActions;
  recipient?: AnyUser;
  colony: Colony;
  payment?: PaymentDetails;
}

const ACTION_TYPES_ICONS_MAP: { [key in ColonyActions]: string } = {
  [ColonyActions.Payment]: 'emoji-dollar-stack',
  [ColonyActions.Recovery]: 'emoji-alarm-lamp',
  [ColonyActions.Generic]: 'circle-check-primary',
};

const DetailsWidget = ({
  activeDomainId,
  actionType = ColonyActions.Generic,
  recipient,
  colony,
  payment,
}: Props) => {
  const { formatMessage } = useIntl();

  const activeDomain = useMemo(() => {
    if (colony?.domains) {
      return colony?.domains?.find(
        ({ ethDomainId }) => ethDomainId === activeDomainId,
      );
    }
    return null;
  }, [colony, activeDomainId]);

  const paymentDomain = useMemo(() => {
    if (payment?.fromDomain) {
      return colony?.domains?.find(
        ({ ethDomainId }) => ethDomainId === payment.fromDomain,
      );
    }
    return null;
  }, [colony, payment]);

  return (
    <div>
      {activeDomain && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.activeTeam} />
          </div>
          <div className={styles.value}>
            {activeDomain.color && <ColorTag color={activeDomain.color} />}
            {` ${activeDomain.name}`}
          </div>
        </div>
      )}
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
      {paymentDomain && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.from} />
          </div>
          <div className={styles.value}>
            <DetailsWidgetTeam domain={paymentDomain} />
          </div>
        </div>
      )}
      {recipient && (
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
      {payment && payment.amount && (
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
              suffix={` ${payment.symbol}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

DetailsWidget.displayName = displayName;

export default DetailsWidget;
