import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import { SimpleMessageValues } from '~types/index';

import styles from './StakingValidationError.css';

interface Props {
  stakeType:
    | 'tokens'
    | 'reputation'
    | 'stakeMoreTokens'
    | 'cantStakeMore'
    | 'stakeMoreReputation';
  errorValues?: SimpleMessageValues;
}

const stakeValidationMSG = defineMessage({
  tokens: {
    id: 'dashboard.ActionsPage.StakingValidationError.tokens',
    defaultMessage: `The minimum stake requirement in this team is {minimumStake}. You only have {userActiveTokens} activated, so cannot provide the minimum stake. Please activate more tokens.`,
  },
  reputation: {
    id: 'dashboard.ActionsPage.StakingValidationError.reputation',
    defaultMessage: `The minimum reputation requirement to stake a motion in this team is {minimumReputation} points. You only have {userReputation} points and therefore do not meet the minimum Reputation requirement to be permitted to stake.`,
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

const StakingValidationError = ({ stakeType, errorValues }: Props) => (
  <div className={styles.validationError}>
    <FormattedMessage {...stakeValidationMSG[stakeType]} values={errorValues} />
  </div>
);

StakingValidationError.displayName = displayName;

export default StakingValidationError;
