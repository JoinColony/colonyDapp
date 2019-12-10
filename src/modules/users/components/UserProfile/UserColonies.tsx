import React from 'react';
import { defineMessages } from 'react-intl';

import ColonyGrid from '~dashboard/ColonyGrid';
import Link from '~core/Link';
import { CREATE_COLONY_ROUTE } from '~routes/index';
import { useLoggedInUser } from '~data/helpers';
import { AnyUser, useUserColonyIdsQuery } from '~data/index';

import { getFriendlyName } from '../../transformers';
import styles from './UserColonies.css';

interface Props {
  user: AnyUser;
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
  const { walletAddress } = useLoggedInUser();
  const friendlyName = getFriendlyName(user);
  // @TODO we should probably get the full colonies and pass them down to colonyGrid
  const { data } = useUserColonyIdsQuery({
    variables: { address: walletAddress },
  });

  // @TODO we want a proper spinner loader here eventually
  if (!data) return null;
  const {
    user: { colonies },
  } = data;
  const colonyAddresses = colonies.map(({ id }) => id);
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
                <span title={friendlyName} className={styles.userHighlight}>
                  {friendlyName}
                </span>
              ),
            }
      }
    />
  );
};

UserColonies.displayName = displayName;

export default UserColonies;
