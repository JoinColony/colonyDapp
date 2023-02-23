import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { IncorporationPayment, prices } from '../constants';

import styles from './TabPanels.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel.title',
    defaultMessage: 'How much does it cost?',
  },
  description: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel.description',
    defaultMessage: `DAO incorporation is a 3rd-party service provided by Korporatio. The payment is made directly to Korporatio and can be done using Motions via your Colony using funds from the Colony.`,
  },
  note: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel.note',
    defaultMessage: `Note: Price can change if the number of protectors is greater then 5. The additional cost will be $50 per extra protector over 5.`,
  },
  initialPayment: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel.initialPayment',
    defaultMessage: 'Payment will be made via Colony',
  },
  currency: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel.currency',
    defaultMessage: 'USDC',
  },
  reneval: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel.reneval',
    defaultMessage: 'Yearly renewal',
  },
  cost: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel.cost',
    defaultMessage: 'Cost',
  },
});

const displayName = 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel';

const CostPanel = () => {
  return (
    <div className={styles.costWrapper}>
      <div>
        <div className={styles.title}>
          <FormattedMessage {...MSG.title} />
        </div>
        <div className={styles.description}>
          <FormattedMessage {...MSG.description} />
          <div className={styles.noteTransparent}>
            <FormattedMessage {...MSG.note} />
          </div>
        </div>
      </div>
      <div>
        <FormattedMessage {...MSG.cost} />
        <ul className={styles.cost}>
          {prices.map((price) => (
            <li key={price.id} className={styles.costItem}>
              <span className={styles.priceText}>
                {price.type === IncorporationPayment.Cost ? (
                  <FormattedMessage {...MSG.initialPayment} />
                ) : (
                  <FormattedMessage {...MSG.reneval} />
                )}
              </span>
              <div className={styles.price}>
                <div className={styles.currency}>
                  <TokenIcon
                    token={price.token}
                    name={price.token.name}
                    size="xs"
                  />
                  {price.token.symbol}
                </div>
                <div className={styles.priceAmount}>
                  <Numeral
                    value={price.amount || 0}
                    unit={getTokenDecimalsWithFallback(
                      price.token && price.token.decimals,
                    )}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

CostPanel.displayName = displayName;

export default CostPanel;
