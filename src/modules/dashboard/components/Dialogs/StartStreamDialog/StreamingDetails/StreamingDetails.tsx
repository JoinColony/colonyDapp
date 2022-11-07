import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { FormSection } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { AnyUser } from '~data/index';
import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';

import FormattedDateAndTime from './FormattedDateAndTime';
import EndDate from './EndDate';
import styles from './StreamingDetails.css';

const displayName = 'dashboard.StartStreamDialog.StreamingDetails';

const MSG = defineMessages({
  to: {
    id: 'dashboard.StartStreamDialog.StreamingDetails.to',
    defaultMessage: 'To',
  },
  starts: {
    id: 'dashboard.StartStreamDialog.StreamingDetails.starts',
    defaultMessage: 'Starts',
  },
  ends: {
    id: 'dashboard.StartStreamDialog.StreamingDetails.ends',
    defaultMessage: 'Ends',
  },
  none: {
    id: 'dashboard.StartStreamDialog.StreamingDetails.none',
    defaultMessage: 'None',
  },
});

interface Props {
  user?: AnyUser;
  endDate?: ExpenditureEndDateTypes;
  endDateTime?: number;
  startDate?: number;
}

const StreamingDetails = ({ user, endDate, endDateTime, startDate }: Props) => (
  <div className={styles.wrapper}>
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={classNames(styles.row, styles.paddingSmall)}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.to} />
        </span>
        <div className={styles.valueContainer}>
          {user ? (
            <div className={styles.userAvatarContainer}>
              <UserAvatar
                address={user.profile.walletAddress || ''}
                size="xs"
                notSet={false}
              />
              <UserMention
                username={
                  user.profile.username || user.profile.displayName || ''
                }
              />
            </div>
          ) : (
            <FormattedMessage {...MSG.none} />
          )}
        </div>
      </div>
    </FormSection>
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={styles.row}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.starts} />
        </span>
        <div className={styles.valueContainer}>
          {startDate ? (
            <FormattedDateAndTime date={startDate} />
          ) : (
            <FormattedMessage {...MSG.none} />
          )}
        </div>
      </div>
    </FormSection>
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={styles.row}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.ends} />
        </span>
        <div className={styles.valueContainer}>
          <EndDate {...{ endDate, endDateTime }} />
        </div>
      </div>
    </FormSection>
  </div>
);

StreamingDetails.displayName = displayName;

export default StreamingDetails;
