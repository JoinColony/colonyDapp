import React from 'react';
import { defineMessages } from 'react-intl';

import Link from '~core/Link';

import styles from './StakesTab.css';

const MSG = defineMessages({
  motionUrl: {
    id: 'users.TokenActivation.TokenActivationContent.StakesListItem.motionUrl',
    defaultMessage: 'Go to motion',
  },
});

interface StakesListItemProps {
  stakedAmount?: string;
  tokenSymbol?: string;
  colonyName?: string;
  txHash?: string;
}

const StakesListItem = ({
  stakedAmount,
  tokenSymbol,
  colonyName,
  txHash,
}: StakesListItemProps) => {
  return (
    <li className={styles.stakesListItem}>
      <div>
        <p>
          <span>
            {stakedAmount} {tokenSymbol}
          </span>
        </p>
        <Link
          className={styles.link}
          text={MSG.motionUrl}
          to={`/colony/${colonyName}/tx/${txHash}`}
        />
      </div>
    </li>
  );
};

export default StakesListItem;
