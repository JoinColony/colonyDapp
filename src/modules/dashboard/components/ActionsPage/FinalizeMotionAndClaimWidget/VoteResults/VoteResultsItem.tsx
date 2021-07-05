import React from 'react';
import { MessageDescriptor } from 'react-intl';

import Icon from '~core/Icon';
import Heading from '~core/Heading';
import ProgressBar from '~core/ProgressBar';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { Address } from '~types/index';
import { getMainClasses } from '~utils/css';
import useAvatarDisplayCounter from '~utils/hooks/useAvatarDisplayCounter';

import styles from './VoteResultsItem.css';

interface Appearance {
  theme?: 'approve' | 'disapprove';
}

interface Props {
  appearance?: Appearance;
  value: number;
  maxValue: number;
  maxPercentage?: number;
  title: string | MessageDescriptor;
  voters?: Address[];
  maxAvatars?: number;
}

const displayName = `dashboard.ActionPage.FinalizeMotionAndClaimWidget.VoteResults.VoteResultsItem`;

const VoteResultsItem = ({
  appearance = { theme: 'approve' },
  value,
  maxValue,
  maxPercentage = 100,
  title,
  voters = [],
  maxAvatars = 3,
}: Props) => {
  const {
    avatarsDisplaySplitRules,
    remainingAvatarsCount,
  } = useAvatarDisplayCounter(maxAvatars, voters);
  const UserAvatar = HookedUserAvatar({ fetchUser: true });
  const iconName =
    appearance.theme === 'approve' ? 'circle-thumbs-up' : 'circle-thumbs-down';
  const votePercentage = (value * maxPercentage) / maxValue;
  const barTheme = appearance.theme === 'approve' ? 'primary' : 'danger';

  return (
    <div className={`${styles.wrapper} ${getMainClasses(appearance, styles)}`}>
      <div className={styles.voteInfoContainer}>
        <Icon name={iconName} title={title} appearance={{ size: 'medium' }} />
        <div className={styles.voteResults}>
          <div className={styles.voteHeading}>
            <Heading
              appearance={{
                theme: 'dark',
                size: 'small',
                weight: 'bold',
                margin: 'none',
              }}
              text={title}
            />
            <span className={styles.votePercentage}>{votePercentage}%</span>
          </div>
          <ProgressBar
            value={votePercentage}
            max={maxPercentage}
            appearance={{
              size: 'small',
              backgroundTheme: 'transparent',
              barTheme,
            }}
          />
        </div>
      </div>
      <div className={styles.voterAvatarsContainer}>
        <ul className={styles.voterAvatars}>
          {voters
            .slice(0, avatarsDisplaySplitRules)
            .map((voterAddress: Address) => (
              <li className={styles.voterAvatar} key={voterAddress}>
                <UserAvatar size="xs" address={voterAddress} notSet={false} />
              </li>
            ))}
        </ul>
        {!!remainingAvatarsCount && (
          <span className={styles.remaningAvatars}>
            {remainingAvatarsCount < 99 ? `+${remainingAvatarsCount}` : `+99`}
          </span>
        )}
      </div>
    </div>
  );
};

VoteResultsItem.displayName = displayName;

export default VoteResultsItem;
