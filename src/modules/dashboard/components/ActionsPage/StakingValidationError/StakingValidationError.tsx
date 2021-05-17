import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';
import { Decimal } from 'decimal.js';
import { BigNumber } from 'ethers/utils';

import styles from './StakingValidationError.css';

interface Props {
  userInactivatedTokens: BigNumber;
  userActivatedTokens: Decimal;
  decimalAmount: Decimal;
}

const stakeValidationMSG = defineMessage({
  hasInactiveTokens: {
    id: 'dashboard.ActionsPage.StakingValidationError.hasInactiveTokens',
    defaultMessage: `You have inactive tokens which cannot be staked, please activate them.`,
  },
  notEnoughTokens: {
    id: 'dashboard.ActionsPage.StakingValidationError.notEnoughTokens',
    defaultMessage: 'You do not have enough activated tokens to stake.',
  },
});

const displayName = 'StakingValidationError';

const StakingValidationError = ({
  userInactivatedTokens,
  userActivatedTokens,
  decimalAmount,
}: Props) => {
  const notEnoughActiveTokens = userActivatedTokens.lt(decimalAmount);
  return (
    <>
      {notEnoughActiveTokens && !userInactivatedTokens.isZero() && (
        <div className={styles.validationError}>
          <FormattedMessage {...stakeValidationMSG.hasInactiveTokens} />
        </div>
      )}
      {notEnoughActiveTokens && userInactivatedTokens.isZero() && (
        <div className={styles.validationError}>
          <FormattedMessage {...stakeValidationMSG.notEnoughTokens} />
        </div>
      )}
    </>
  );
};

StakingValidationError.displayName = displayName;

export default StakingValidationError;
