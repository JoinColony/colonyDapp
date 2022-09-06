import React from 'react';
import classnames from 'classnames';
import { defineMessage, FormattedMessage } from 'react-intl';

import Avatar from '~core/Avatar';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../DetailsWidgetSafeTransaction.css';

const MSG = defineMessage({
  contract: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.ContractName.contract`,
    defaultMessage: 'Contract',
  },
});

interface ContractNameProps {
  name: string;
  address: string;
  showMaskedAddress?: boolean;
}

export const ContractName = ({ name, address }: ContractNameProps) => (
  <div className={classnames(widgetStyles.item, styles.contractItem)}>
    <div className={widgetStyles.label}>
      <FormattedMessage {...MSG.contract} />
    </div>
    <div className={widgetStyles.value}>
      <Avatar
        seed={address.toLowerCase()}
        title="Contract Avatar"
        placeholderIcon="gnosis-logo"
      />
      <div className={styles.contractAddress}>
        <span>{name}</span>
      </div>
    </div>
  </div>
);
