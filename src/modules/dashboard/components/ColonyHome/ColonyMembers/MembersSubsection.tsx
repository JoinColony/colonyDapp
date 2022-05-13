import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Maybe from 'graphql/tsutils/Maybe';

import NavLink from '~core/NavLink';
import Heading from '~core/Heading';
import { Tooltip } from '~core/Popover';
import Icon from '~core/Icon';

import HookedUserAvatar from '~users/HookedUserAvatar';
import useAvatarDisplayCounter from '~utils/hooks/useAvatarDisplayCounter';
import { Colony, useLoggedInUser, BannedUser, UserProfile } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { Address } from '~types/index';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot, canAdminister } from '~modules/users/checks';

import styles from './ColonyMembers.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyHome.ColonyMembers.MembersSubsection.title',
    defaultMessage: `{isContributors, select,
      true { Contributors }
      other { Watchers }
    } {hasCounter, select,
        true { ({count})}
        false {}
      }`,
  },
  loadingData: {
    id: 'dashboard.ColonyHome.ColonyMembers.MembersSubsection.loadingData',
    defaultMessage: 'Loading members information...',
  },
  reputationFetchFailed: {
    id: `dashboard.ColonyHome.ColonyMembers.MembersSubsection.reputationFetchFailed`,
    defaultMessage: `Failed to fetch the colony's {isContributors, select,
      true { contributors }
      other { watchers }
    }`,
  },
  tooltipText: {
    id: 'dashboard.ColonyHome.ColonyMembers.MembersSubsection.tooltipText',
    defaultMessage: `{isContributors, select,
      true {Contributors are members of the Colony who have earned reputation.}
      other { Watchers are members of the Colony
         who currently don’t have reputation. }
    }`,
  },
});

type BannedMember = Maybe<
  Pick<BannedUser, 'id' | 'eventId' | 'banned'> & {
    profile?:
      | Maybe<Pick<UserProfile, 'displayName' | 'username' | 'walletAddress'>>
      | undefined;
  }
>;

interface Props {
  colony: Colony;
  currentDomainId?: number;
  maxAvatars?: number;
  members: Maybe<string[]>;
  bannedMembers?: BannedMember[];
  isContributors: boolean;
}

const UserAvatar = HookedUserAvatar({ fetchUser: true });

const displayName = 'dashboard.ColonyHome.ColonyMembers.MembersSubsection';

const MembersSubsection = ({
  colony: { colonyName },
  members,
  bannedMembers,
  isContributors,
  colony,
  currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
  maxAvatars = 15,
}: Props) => {
  const {
    walletAddress: currentUserWalletAddress,
    username,
    ethereal,
  } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    currentUserWalletAddress,
  ]);
  const canAdministerComments =
    hasRegisteredProfile &&
    (hasRoot(allUserRoles) || canAdminister(allUserRoles));

  const {
    avatarsDisplaySplitRules,
    remainingAvatarsCount,
  } = useAvatarDisplayCounter(maxAvatars, members, false);

  const BASE_MEMBERS_ROUTE = `/colony/${colonyName}/members`;
  const membersPageRoute =
    currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
      ? BASE_MEMBERS_ROUTE
      : `${BASE_MEMBERS_ROUTE}/${currentDomainId}`;

  const colonyMembersWithBanStatus = useMemo(
    () =>
      (members || []).map((walletAddress) => {
        const isUserBanned = bannedMembers?.find(
          ({
            id: bannedUserWalletAddress,
            banned,
          }: {
            id: Address;
            banned: boolean;
          }) => banned && bannedUserWalletAddress === walletAddress,
        );
        return {
          walletAddress,
          banned: canAdministerComments ? !!isUserBanned : false,
        };
      }),
    [members, bannedMembers, canAdministerComments],
  );

  const setHeading = useCallback(
    (hasCounter) => (
      <Tooltip
        content={
          <div className={styles.tooltip}>
            <FormattedMessage
              {...MSG.tooltipText}
              values={{ isContributors }}
            />
          </div>
        }
      >
        <NavLink to={membersPageRoute}>
          <Heading
            appearance={{ size: 'normal', weight: 'bold' }}
            text={MSG.title}
            textValues={{
              count: members?.length,
              hasCounter,
              isContributors,
            }}
          />
        </NavLink>
      </Tooltip>
    ),
    [members, membersPageRoute, isContributors],
  );

  if (!members) {
    return (
      <div className={styles.main}>
        {setHeading(false)}
        <span className={styles.loadingText}>
          <FormattedMessage
            {...MSG.reputationFetchFailed}
            values={{ isContributors }}
          />
        </span>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {setHeading(true)}
      <ul className={styles.userAvatars}>
        {colonyMembersWithBanStatus
          .slice(0, avatarsDisplaySplitRules)
          .map(({ walletAddress, banned }) => (
            <li className={styles.userAvatar} key={walletAddress}>
              <UserAvatar
                size="xs"
                address={walletAddress}
                banned={banned}
                showInfo
                notSet={false}
                colony={colony}
                popperOptions={{
                  placement: 'bottom',
                  showArrow: false,
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        /*
                         * @NOTE Values are set manual, exactly as the ones provided in the figma spec.
                         *
                         * There's no logic to how they are calculated, so next time you need
                         * to change them you'll either have to go by exact specs, or change
                         * them until it "feels right" :)
                         */
                        offset: [-208, -12],
                      },
                    },
                  ],
                }}
              />
              {/*
               * @TODO Replace with proper user banned icon
               */}
              {banned && (
                <div className={styles.userBanned}>
                  <Icon
                    appearance={{ size: 'extraTiny' }}
                    name="shield-pink"
                    title={{ id: 'label.banned' }}
                  />
                </div>
              )}
            </li>
          ))}
        {!!remainingAvatarsCount && (
          <li className={styles.caretIconLink}>
            <NavLink to={membersPageRoute}>
              <Icon appearance={{ size: 'medium' }} name="caret-right" />
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

MembersSubsection.displayName = displayName;

export default MembersSubsection;
