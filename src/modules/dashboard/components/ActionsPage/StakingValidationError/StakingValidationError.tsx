import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import styles from './StakingValidationError.css';

interface Props {
  stakeType: 'tokens' | 'reputation';
}

const stakeValidationMSG = defineMessage({
  tokens: {
    id: 'dashboard.ActionsPage.StakingValidationError.notEnoughTokens',
    defaultMessage: 'You do not have enough active tokens to stake.',
  },
  reputation: {
    id: 'dashboard.ActionsPage.StakingValidationError.notEnoughTokens',
    defaultMessage: 'You do not have enough reputation to stake.',
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
