import { nanoid } from 'nanoid';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';

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
  price1: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel.price1',
    defaultMessage: 'Payment will be made via Colony',
  },
  currency: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel.currency',
    defaultMessage: 'USDC',
  },
  price2: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel.price2',
    defaultMessage: 'Yearly renewal',
  },
  cost: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.CostPanel.cost',
    defaultMessage: 'Cost',
  },
});

const prices = [
  {
    id: nanoid(),
    text: <FormattedMessage {...MSG.price1} />,
    amount: '5,300.00',
  },
  {
    id: nanoid(),
    text: <FormattedMessage {...MSG.price2} />,
    amount: '3,800.00',
  },
];

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
              <span className={styles.priceText}>{price.text}</span>
              <div className={styles.price}>
                <div className={styles.currency}>
                  <Icon name="usd-coin" appearance={{ size: 'medium' }} />
                  <FormattedMessage {...MSG.currency} />
                </div>
                <div className={styles.priceAmount}>{price.amount}</div>
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
