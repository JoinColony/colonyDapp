import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import styles from './StakingValidationError.css';

interface Props {
  stakeType: 'tokens' | 'reputation' | 'stakeMore';
}

const stakeValidationMSG = defineMessage({
  tokens: {
    id: 'dashboard.ActionsPage.StakingValidationError.tokens',
    defaultMessage: 'You do not have enough active tokens to stake.',
  },
  reputation: {
    id: 'dashboard.ActionsPage.StakingValidationError.reputation',
    defaultMessage: 'You do not have enough reputation to be able to stake.',
  },
  stakeMore: {
    id: 'dashboard.ActionsPage.StakingValidationError.stakeMore',
    defaultMessage: 'You do not have enough active tokens to stake more.',
  },
});

const displayName = 'StakingValidationError';

const StakingValidationError = ({ stakeType }: Props) => (
  <div className={styles.validationError}>
    <FormattedMessage {...stakeValidationMSG[stakeType]} />
  </div>
);

StakingValidationError.displayName = displayName;

export default StakingValidationError;
