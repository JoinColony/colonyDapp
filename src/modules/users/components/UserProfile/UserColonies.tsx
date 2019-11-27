import React from 'react';
import { defineMessages } from 'react-intl';

import { UserType } from '~immutable/index';
import { useDataSubscriber, useSelector } from '~utils/hooks';
import ColonyGrid from '~dashboard/ColonyGrid';
import Link from '~core/Link';
import { CREATE_COLONY_ROUTE } from '~routes/index';
import { useCurrentUser } from '~data/helpers';

import { userColoniesSubscriber } from '../../../dashboard/subscribers';
import { friendlyUsernameSelector } from '../../selectors';
import styles from './UserColonies.css';

interface Props {
  user: UserType;
}

const MSG = defineMessages({
  currentUserNoColonies: {
    id: 'users.UserProfile.UserColonies.currentUserNoColonies',
    defaultMessage: `It looks like you're not subscribed to any Colonies yet. You’ll need an invite link to join one. Ask your community for a link or {createColonyLink}.`,
  },
  otherUserNoColonies: {
    id: 'users.UserProfile.UserColonies.otherUserNoColonies',
    defaultMessage: `It looks like {friendlyUsername} isn't subscribed to any Colonies yet. You’ll might want to send them an invite link from a Colony you're part of.`,
  },
  createColonyLink: {
    id: 'users.UserProfile.UserColonies.createColonyLink',
    defaultMessage: `create a new colony`,
  },
});

const displayName = 'users.UserProfile.UserColonies';

const UserColonies = ({ user }: Props) => {
  const { walletAddress } = useCurrentUser();
  const { data: colonyAddresses } = useDataSubscriber(
    userColoniesSubscriber,
    [user.profile.walletAddress],
    [user.profile.walletAddress, user.profile.metadataStoreAddress],
  );
  const friendlyUsername = useSelector(friendlyUsernameSelector, [
    user.profile.walletAddress,
  ]) as string;
  const isCurrentUser = walletAddress === user.profile.walletAddress;
  return (
    <ColonyGrid
      colonyAddresses={colonyAddresses || []}
      emptyStateDescription={
        isCurrentUser ? MSG.currentUserNoColonies : MSG.otherUserNoColonies
      }
      emptyStateDescriptionValues={
        isCurrentUser
          ? {
              createColonyLink: (
                <Link
                  to={CREATE_COLONY_ROUTE}
                  text={MSG.createColonyLink}
                  className={styles.createColonyLink}
                />
              ),
            }
          : {
              friendlyUsername: (
                <span title={friendlyUsername} className={styles.userHighlight}>
                  {friendlyUsername}
                </span>
              ),
            }
      }
    />
  );
};

UserColonies.displayName = displayName;

export default UserColonies;
