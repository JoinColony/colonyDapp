/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { Address } from '~types';
import type { UserType } from '~immutable';

import { useDataFetcher, useSelector } from '~utils/hooks';
import ColonyGrid from '~dashboard/ColonyGrid';
import Link from '~core/Link';

import { userColoniesFetcher } from '../../../dashboard/fetchers';
import { currentUserSelector, friendlyUsernameSelector } from '../../selectors';

import { CREATE_COLONY_ROUTE } from '~routes';

import styles from './UserColonies.css';

type Props = {|
  user: UserType,
|};

const MSG = defineMessages({
  currentUserNoColonies: {
    id: 'users.UserProfile.UserColonies.currentUserNoColonies',
    // eslint-disable-next-line max-len
    defaultMessage: `It looks like you're not subscribed to any Colonies yet. You’ll need an invite link to join one. Ask your community for a link or {createColonyLink}.`,
  },
  otherUserNoColonies: {
    id: 'users.UserProfile.UserColonies.otherUserNoColonies',
    // eslint-disable-next-line max-len
    defaultMessage: `It looks like {friendlyUsername} isn't subscribed to any Colonies yet. You’ll might want to send them an invite link from a Colony you're part of.`,
  },
  createColonyLink: {
    id: 'users.UserProfile.UserColonies.createColonyLink',
    defaultMessage: `create a new colony`,
  },
});

const displayName = 'users.UserProfile.UserColonies';

const UserColonies = ({ user }: Props) => {
  const { data: colonyAddresses } = useDataFetcher<Address[]>(
    userColoniesFetcher,
    [user.profile.walletAddress],
    [user.profile.walletAddress, user.profile.metadataStoreAddress],
  );
  const {
    profile: { walletAddress: currentUserWalletAddress },
  } = useSelector(currentUserSelector);
  const friendlyUsername: string = useSelector(friendlyUsernameSelector, [
    user.profile.walletAddress,
  ]);
  const isCurrentUser = currentUserWalletAddress === user.profile.walletAddress;
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
