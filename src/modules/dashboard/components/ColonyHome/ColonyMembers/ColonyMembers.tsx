import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import NavLink from '~core/NavLink';
import Heading from '~core/Heading';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { MiniSpinnerLoader } from '~core/Preloaders';
import useAvatarDisplayCounter from '~utils/hooks/useAvatarDisplayCounter';
import {
  Colony,
  useColonyMembersWithReputationQuery,
  useMembersSubscription,
} from '~data/index';
import { Address } from '~types/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

import styles from './ColonyMembers.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyHome.ColonyMembers.title',
    defaultMessage: `Members{hasCounter, select,
      true { ({count})}
      false {}
    }`,
  },
  loadingData: {
    id: 'dashboard.ColonyHome.ColonyMembers.loadingData',
    defaultMessage: 'Loading members information...',
  },
  reputationFetchFailed: {
    id: 'dashboard.ColonyHome.ColonyMembers.reputationFetchFailed',
    defaultMessage: "Failed to fetch the colony's members",
  },
});

interface Props {
  colony: Colony;
  currentDomainId?: number;
  maxAvatars?: number;
}

const UserAvatar = HookedUserAvatar({ fetchUser: true });

const displayName = 'dashboard.ColonyHome.ColonyMembers';

const ColonyMembers = ({
  colony: { colonyAddress, colonyName },
  colony,
  currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
  maxAvatars = 15,
}: Props) => {
  const {
    data: membersWithReputation,
    loading: loadingColonyMembersWithReputation,
  } = useColonyMembersWithReputationQuery({
    variables: {
      colonyAddress,
      domainId: currentDomainId,
    },
  });

  const { data: members, loading: loadingMembers } = useMembersSubscription({
    variables: {
      colonyAddress,
    },
  });

  const colonyMembers = useMemo(() => {
    if (currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
      return members?.subscribedUsers?.map(
        ({ profile: { walletAddress } }) => walletAddress,
      );
    }
    return membersWithReputation?.colonyMembersWithReputation;
  }, [members, membersWithReputation, currentDomainId]);

  const {
    avatarsDisplaySplitRules,
    remainingAvatarsCount,
  } = useAvatarDisplayCounter(maxAvatars, colonyMembers, false);

  const BASE_MEMBERS_ROUTE = `/colony/${colonyName}/members`;
  const membersPageRoute =
    currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
      ? BASE_MEMBERS_ROUTE
      : `${BASE_MEMBERS_ROUTE}/${currentDomainId}`;

  if (loadingColonyMembersWithReputation || loadingMembers) {
    return (
      <MiniSpinnerLoader
        className={styles.main}
        title={MSG.title}
        loadingText={MSG.loadingData}
        titleTextValues={{ hasCounter: false }}
      />
    );
  }

  if (!colonyMembers) {
    return (
      <div className={styles.main}>
        <Heading
          appearance={{ size: 'normal', weight: 'bold' }}
          text={MSG.title}
          textValues={{ hasCounter: false }}
        />
        <span className={styles.loadingText}>
          <FormattedMessage {...MSG.reputationFetchFailed} />
        </span>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <NavLink to={membersPageRoute}>
        <Heading
          appearance={{ size: 'normal', weight: 'bold' }}
          text={MSG.title}
          textValues={{
            count: colonyMembers.length,
            hasCounter: true,
          }}
        />
      </NavLink>
      <ul className={styles.userAvatars}>
        {(colonyMembers as Address[])
          .slice(0, avatarsDisplaySplitRules)
          .map((userAddress: Address) => (
            <li className={styles.userAvatar} key={userAddress}>
              <UserAvatar
                size="xs"
                colony={colony}
                address={userAddress}
                showInfo
                notSet={false}
                popperProps={{
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
            </li>
          ))}
        {!!remainingAvatarsCount && (
          <li className={styles.remaningAvatars}>
            {remainingAvatarsCount < 99 ? remainingAvatarsCount : `>99`}
          </li>
        )}
      </ul>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
