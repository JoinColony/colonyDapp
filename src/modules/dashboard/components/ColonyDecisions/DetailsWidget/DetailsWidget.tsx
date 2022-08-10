import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import DetailsWidgetUser from '~core/DetailsWidgetUser';
import { AnyUser, Colony } from '~data/index';
import { EventValues } from '../../ActionsPageFeed/ActionsPageFeed';

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
  decisionType: string;
  author?: AnyUser;
  values?: EventValues;
  colony: Colony;
}

const DetailsWidget = ({ author, values, colony }: Props) => {
  return (
    <div>
      <div className={styles.item}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.decisionType} />
        </div>
        <div className={styles.value}>
          <div className={styles.text}>
            <FormattedMessage {...MSG.decisionType} />
          </div>
        </div>
      </div>
      {values?.fromDomain && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.domain} />
          </div>
          <div className={styles.value}>
            {values?.fromDomain && (
              <DetailsWidgetTeam domain={values.fromDomain} />
            )}
          </div>
        </div>
      )}
      {author && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.author} />
          </div>
          <div className={styles.value}>
            {author && (
              <DetailsWidgetUser
                colony={colony}
                walletAddress={author?.profile.walletAddress as string}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

DetailsWidget.displayName = displayName;

export default DetailsWidget;
