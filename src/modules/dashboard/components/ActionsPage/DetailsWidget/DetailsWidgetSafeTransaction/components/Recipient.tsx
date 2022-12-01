import React from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { AnyUser, Colony } from '~data/index';
import DetailsWidgetUser from '~core/DetailsWidgetUser';

import { toRecipientMSG } from '../../DetailsWidget';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../DetailsWidgetSafeTransaction.css';

interface RecipientProps {
  recipient: AnyUser;
  colony: Colony;
}

export const Recipient = ({ recipient, colony }: RecipientProps) => (
  <div className={classnames(widgetStyles.item, styles.recipient)}>
    <div className={widgetStyles.label}>
      <FormattedMessage {...toRecipientMSG} />
    </div>
    <div className={widgetStyles.value}>
      <DetailsWidgetUser
        colony={colony}
        walletAddress={recipient.profile.walletAddress}
      />
    </div>
  </div>
);
