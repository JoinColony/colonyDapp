import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { FormSection } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { AnyUser } from '~data/index';
import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';
import { capitalize } from '~utils/strings';

import FormattedDateAndTime from './FormattedDateAndTime';
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
});

interface Props {
  user: AnyUser;
  endDate: ExpenditureEndDateTypes;
  endDateTime: number;
  startDate: number;
}

const StreamingDetails = ({ user, endDate, endDateTime, startDate }: Props) => (
  <div className={styles.wrapper}>
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={classNames(styles.row, styles.paddingSmall)}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.to} />
        </span>
        <div className={styles.valueContainer}>
          <div className={styles.userAvatarContainer}>
            <UserAvatar
              address={user.profile.walletAddress || ''}
              size="xs"
              notSet={false}
            />
            <UserMention
              username={user.profile.username || user.profile.displayName || ''}
            />
          </div>
        </div>
      </div>
    </FormSection>
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={styles.row}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.starts} />
        </span>
        <div className={styles.valueContainer}>
          <FormattedDateAndTime date={startDate} />
        </div>
      </div>
    </FormSection>
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={styles.row}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.ends} />
        </span>
        <div className={styles.valueContainer}>
          {endDate === ExpenditureEndDateTypes.FixedTime ? (
            <FormattedDateAndTime date={endDateTime} />
          ) : (
            capitalize(endDate.replace(/-/g, ' '))
          )}
        </div>
      </div>
    </FormSection>
  </div>
);

StreamingDetails.displayName = displayName;

export default StreamingDetails;
