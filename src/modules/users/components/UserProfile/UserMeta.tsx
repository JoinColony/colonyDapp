import React from 'react';
import { defineMessages } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import { AnyUser, useLoggedInUser } from '~data/index';

import CopyableAddress from '~core/CopyableAddress';
import ExternalLink from '~core/ExternalLink';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import UserMention from '~core/UserMention';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { stripProtocol } from '~utils/strings';

import { query700 as query } from '~styles/queries.css';
import styles from './UserMeta.css';

const MSG = defineMessages({
  editProfileTitle: {
    id: 'users.UserProfile.UserMeta.editProfileTitle',
    defaultMessage: 'Edit Profile',
  },
});

const UserAvatar = HookedUserAvatar({ fetchUser: false });

interface Props {
  user: AnyUser;
}

const componentDisplayName = 'users.UserProfile.UserMeta';

const UserMeta = ({
  user: {
    profile: { username, displayName, bio, website, location, walletAddress },
  },
  user,
}: Props) => {
  const { walletAddress: currentUserWalletAddress } = useLoggedInUser();
  const isMobile = useMediaQuery({ query });
  return (
    <div className={styles.main}>
      <div data-test="userProfileAvatar">
        <UserAvatar
          className={styles.avatar}
          address={walletAddress}
          size={isMobile ? 'm' : 'xl'}
          user={user}
          notSet={false}
        />
      </div>
      <div className={styles.headingContainer}>
        {displayName && (
          <Heading
            appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}
            text={displayName}
            data-test="userProfileName"
          />
        )}
        {currentUserWalletAddress === walletAddress && (
          <Link className={styles.profileLink} to="/edit-profile">
            <Icon name="settings" title={MSG.editProfileTitle} />
          </Link>
        )}
      </div>
      <div className={styles.usernameContainer}>
        <UserMention username={username || walletAddress} hasLink={false} />
      </div>
      <CopyableAddress>{walletAddress}</CopyableAddress>
      {bio && (
        <div className={styles.bioContainer}>
          <p data-test="userProfileBio">{bio}</p>
        </div>
      )}
      {website && (
        <div className={styles.websiteContainer} title={stripProtocol(website)}>
          <ExternalLink href={website} text={stripProtocol(website)} />
        </div>
      )}
      {location && (
        <div className={styles.locationContainer}>
          <Heading
            appearance={{ size: 'normal', weight: 'thin' }}
            text={location}
            data-test="userProfileLocation"
          />
        </div>
      )}
    </div>
  );
};

UserMeta.displayName = componentDisplayName;

export default UserMeta;
