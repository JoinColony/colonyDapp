import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import { UniversalMessageValues } from '~types/index';

import styles from './StakingValidationError.css';

interface Props {
  stakeType:
    | 'tokens'
    | 'reputation'
    | 'stakeMoreTokens'
    | 'cantStakeMore'
    | 'stakeMoreReputation';
  errorValues?: UniversalMessageValues;
}

const stakeValidationMSG = defineMessage({
  tokens: {
    id: 'dashboard.ActionsPage.StakingValidationError.tokens',
    defaultMessage: `Activate more tokens to be eligible to stake.`,
  },
  reputation: {
    id: 'dashboard.ActionsPage.StakingValidationError.reputation',
    defaultMessage: `The minimum reputation required to stake in this team is {minimumReputation} points. When this motion was created you only had {userReputation} points, so you can't stake on this motion. If you now have more than {minimumReputation} Reputation points, you will be able to stake on future motions.`,
  },
  stakeMoreTokens: {
    id: 'dashboard.ActionsPage.StakingValidationError.stakeMore',
    defaultMessage: `Oops! You don't have enough active tokens. To stake more than this, please activate more tokens.`,
  },
  stakeMoreReputation: {
    id: 'dashboard.ActionsPage.StakingValidationError.reputation',
    defaultMessage: `Oops! Your ability to stake is limited by the amount of Reputation you have. To be able to stake more, you'll need to earn more Reputation.`,
  },
  cantStakeMore: {
    id: 'dashboard.ActionsPage.StakingValidationError.stakeMore',
    defaultMessage: `The motion can't be staked more than the minimum stake.`,
  },
});

const displayName = 'StakingValidationError';

const StakingValidationError = ({ stakeType, errorValues }: Props) => {
  if (stakeType === 'tokens') {
    return (
      <div className={styles.tokenValidationError}>
        <FormattedMessage {...stakeValidationMSG[stakeType]} />
      </div>
    );
  }

  return (
    <div className={styles.validationError}>
      <FormattedMessage
        {...stakeValidationMSG[stakeType]}
        values={errorValues}
      />
    </div>
  );
};

StakingValidationError.displayName = displayName;

export default StakingValidationError;
