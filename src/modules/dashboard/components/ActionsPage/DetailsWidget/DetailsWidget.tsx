import React, { ReactNode, useState, useEffect } from 'react';
import { getMainClasses } from '~utils/css';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useColonyDomainsQuery, Domain, AnyToken } from '~data/index';
import { Address } from '~types/index';
import ColorTag, { Color } from '~core/ColorTag';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~core/Numeral';

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

// @TODO we need to add here all possible action types, we need also icons
export enum ActionTypes {
  PAYMENT = 'paymentActionType',
  TRANSFER_FUNDS = 'transferFundsActionType',
  RECORVERY_MODE = 'recoveryModeActionType',
}

interface Props {
  domainId?: number;
  actionType: ActionTypes;
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
  colonyAddress
}: Props) => {
  const [domain, setDomain] = useState<Domain>();

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
        setDomain(domain);
      }
    }
  }, [data, domainId]);
  return (
    <div>
      {domain && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage
              {...MSG.activeTeam}
            />
          </div>
          <div className={styles.value}>
            {domain.color && (
              <ColorTag color={domain.color} />
            )}
            {` ${domain.name}`}
          </div>
        </div>
      )}
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage
            {...MSG.actionType}
          />
        </div>
        <div className={styles.value}>
          <FormattedMessage
            {...MSG[actionType]}
          />
        </div>
      </div>
      {from && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage
              {...MSG.from}
            />
          </div>
          <div className={styles.value}>
            {from}
          </div>
        </div>
      )}
      {to && (
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage
            {...MSG.to}
          />
        </div>
        <div className={styles.value}>
          {to}
        </div>
      </div>
      )}
      {token && amount && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage
              {...MSG.value}
            />
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
