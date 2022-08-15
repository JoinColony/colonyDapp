import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl,
} from 'react-intl';

import DetailsWidgetUser from '~core/DetailsWidgetUser';
import { Colony, OneDomain } from '~data/index';

import DetailsWidgetTeam from '../../ActionsPage/DetailsWidget/DetailsWidgetTeam';

import styles from './DetailsWidget.css';

const displayName = 'dashboard.ColonyDecisions.DetailsWidget';

const MSG = defineMessages({
  decisionType: {
    id: 'dashboard.ColonyDecisions.DetailsWidget.ColonyDecisions',
    defaultMessage: 'Type',
  },
  domain: {
    id: 'dashboard.ColonyDecisions.DetailsWidget.domain',
    defaultMessage: 'Team',
  },
  author: {
    id: 'dashboard.ColonyDecisions.DetailsWidget.author',
    defaultMessage: 'Author',
  },
});

interface Props {
  decisionType: MessageDescriptor;
  walletAddress?: string;
  domain?: OneDomain;
  colony: Colony;
}

const DetailsWidget = ({
  decisionType,
  walletAddress,
  domain,
  colony,
}: Props) => {
  const { formatMessage } = useIntl();
  const decisionText = formatMessage(decisionType);
  return (
    <div>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.decisionType} />
        </div>
        <div className={styles.value}>
          <div className={styles.text}>{decisionText}</div>
        </div>
      </div>
      {domain && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.domain} />
          </div>
          <div className={styles.value}>
            {domain && <DetailsWidgetTeam domain={domain} />}
          </div>
        </div>
      )}
      {walletAddress && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.author} />
          </div>
          <div className={styles.value}>
            <DetailsWidgetUser colony={colony} walletAddress={walletAddress} />
          </div>
        </div>
      )}
    </div>
  );
};

DetailsWidget.displayName = displayName;

export default DetailsWidget;
