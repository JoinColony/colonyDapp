import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import UserMention from '~core/UserMention';
import CopyableAddress from '~core/CopyableAddress';
import Badge from '~core/Badge';
import { SpinnerLoader } from '~core/Preloaders';
import { AnyUser, useUserBadgesQuery } from '~data/index';

import styles from './InfoPopover.css';

interface Props {
  user: AnyUser;
}

const MSG = defineMessages({
  achievement: {
    id: 'core.InfoPopover.UserInfoPopover.achievement',
    defaultMessage: '{title} achievement earned in {programTitle}',
  },
});

const displayName = 'InfoPopover.UserInfoPopover';

const UserInfoPopover = ({ user }: Props) => {
  const { formatMessage } = useIntl();
  const {
    displayName: userDisplayName,
    username,
    walletAddress,
  } = user.profile;

  const { data, loading } = useUserBadgesQuery({
    variables: { address: walletAddress },
  });

  const completedLevels = data ? data.user.completedLevels : [];

  return (
    <div className={styles.main}>
      {userDisplayName && (
        <p className={styles.displayName}>{userDisplayName}</p>
      )}
      {username && (
        <p className={styles.userName}>
          <UserMention username={username} hasLink />
        </p>
      )}
      <div className={styles.address}>
        <CopyableAddress full>{walletAddress}</CopyableAddress>
      </div>
      <div className={styles.badges}>
        {loading ? (
          <SpinnerLoader appearance={{ size: 'small' }} />
        ) : (
          completedLevels.map(
            ({ achievement, id, title, program: { title: programTitle } }) =>
              achievement &&
              title && (
                <Badge
                  key={id}
                  size="xs"
                  name={achievement}
                  title={formatMessage(MSG.achievement, {
                    title,
                    programTitle,
                  })}
                />
              ),
          )
        )}
      </div>
    </div>
  );
};

UserInfoPopover.displayName = displayName;

export default UserInfoPopover;
