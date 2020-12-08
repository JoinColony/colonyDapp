import React, { ReactNode, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import ColorTag from '~core/ColorTag';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useColonyDomainsQuery, AnyToken, OneDomain } from '~data/index';
import { ColonyActionTypes } from '../types';

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
  paymentActionType: {
    id: 'dashboard.ActionsPage.DetailsWidget.paymentActionType',
    defaultMessage: 'Payment',
  },
  transferFundsActionType: {
    id: 'dashboard.ActionsPage.DetailsWidget.transferFundsActionType',
    defaultMessage: 'Transfer Funds',
  },
  recoveryModeActionType: {
    id: 'dashboard.ActionsPage.DetailsWidget.recoveryModeActionType',
    defaultMessage: 'Recovery Mode',
  },
});

interface Props {
  domainId?: number;
  actionType: ColonyActionTypes;
  from?: ReactNode;
  to?: ReactNode;
  amount?: number;
  token?: AnyToken;
  colonyAddress?: Address;
}

const DetailsWidget = ({
  domainId,
  actionType,
  from,
  to,
  amount,
  token,
  colonyAddress,
}: Props) => {
  const [activeTeam, setActiveTeam] = useState<OneDomain | undefined>();

  const { data } = useColonyDomainsQuery({
    variables: { colonyAddress: colonyAddress || '' },
  });

  useEffect(() => {
    if (data) {
      const domain = data.colony.domains.find(
        ({ ethDomainId }) => Number(domainId) === ethDomainId,
      );
      if (domain) {
        // Any idea why TS is complaning here?
        setActiveTeam(domain);
      }
    }
  }, [data, domainId]);
  return (
    <div className={styles.wrapper}>
      {activeTeam && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.activeTeam} />
          </div>
          <div className={styles.value}>
            {activeTeam.color && <ColorTag color={activeTeam.color} />}
            {` ${activeTeam?.name}`}
          </div>
        </div>
      )}
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.actionType} />
        </div>
        <div className={styles.value}>
          <FormattedMessage {...MSG[actionType]} />
        </div>
      </div>
      {from && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.from} />
          </div>
          <div className={styles.value}>{from}</div>
        </div>
      )}
      {to && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.to} />
          </div>
          <div className={styles.value}>{to}</div>
        </div>
      )}
      {token && amount && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.value} />
          </div>
          <div className={styles.value}>
            <Numeral
              value={amount}
              unit={getTokenDecimalsWithFallback(token.decimals)}
              suffix={` ${token.symbol}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

DetailsWidget.displayName = displayName;

export default DetailsWidget;
