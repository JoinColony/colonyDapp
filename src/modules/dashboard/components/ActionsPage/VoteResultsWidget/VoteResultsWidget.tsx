import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import Heading from '~core/Heading';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { Colony } from '~data/index';
import { Address } from '~types/index';
import { getMainClasses } from '~utils/css';

import useAvatarDisplayCounter from '../../../hooks/useAvatarDisplayCounter';

import styles from './VoteResultsWidget.css';

interface Appearance {
  theme?: 'approve' | 'disapprove';
}

const MSG = defineMessages({
  title: {
    id: 'dashboard.ActionsPage.VoteResultsWidget.title',
    defaultMessage: '{title}',
  },
  reputationPercentage: {
    id: 'dashboard.ActionsPage.VoteResultsWidget.reputationPercentage',
    defaultMessage: '{percentage}%',
  },
});

interface Props {
  colony: Colony;
  appearance?: Appearance;
  value?: number;
  title: string;
  voters?: Address[];
  maxAvatars?: number;
}

const displayName = 'VoteResultsWidget';

const VoteResultsWidget = ({
  colony: { colonyAddress },
  appearance = { theme: 'approve' },
  value = 0,
  title,
  voters = [],
  maxAvatars = 3,
}: Props) => {
  const { formatMessage } = useIntl();
  const {
    avatarsDisplaySplitRules,
    remainingAvatarsCount,
  } = useAvatarDisplayCounter(maxAvatars, voters);
  const UserAvatar = HookedUserAvatar({ fetchUser: true });
  const iconName =
    appearance.theme === 'approve' ? 'circle-thumbs-up' : 'circle-thumbs-down';

  return (
    <div className={`${styles.wrapper} ${getMainClasses(appearance, styles)}`}>
      <div className={styles.voteInfoContainer}>
        <Icon
          name={iconName}
          title={formatMessage(MSG.title, { title })}
          appearance={{ size: 'medium' }}
        />
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
            <span className={styles.votePercentage}>
              <FormattedMessage
                {...MSG.reputationPercentage}
                values={{ percentage: value }}
              />
            </span>
          </div>
          <div
            style={{ width: `${value}%` }}
            className={styles.votePercentageBar}
          />
        </div>
      </div>
      <div className={styles.voterAvatarsContainer}>
        <ul className={styles.voterAvatars}>
          {voters
            .slice(0, avatarsDisplaySplitRules)
            .map((voterAddress: Address) => (
              <li className={styles.voterAvatar} key={voterAddress}>
                <UserAvatar
                  size="xs"
                  colonyAddress={colonyAddress}
                  address={voterAddress}
                  notSet={false}
                />
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

VoteResultsWidget.displayName = displayName;

export default VoteResultsWidget;
