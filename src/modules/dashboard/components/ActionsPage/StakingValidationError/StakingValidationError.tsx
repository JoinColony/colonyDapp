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
    defaultMessage: `You have inactive tokens which cannot be staked, please activate them. <a>Learn more</a>`,
  },
  notEnoughTokens: {
    id: 'dashboard.ActionsPage.StakingValidationError.notEnoughTokens',
    defaultMessage:
      'You do not have enough activated tokens to stake. <a>Learn more</a>',
  },
});

// @TODO: Add actual links for help
const INACTIVE_TOKEN_HELP_LINK = '/';
const NOT_ENOUGH_TOKENS_HELP_LINK = '/';

const displayName = 'StakingValidationError';

const StakingValidationError = ({
  userInactivatedTokens,
  userActivatedTokens,
  decimalAmount,
}: Props) => (
  <>
    {!userInactivatedTokens.isZero() && (
      <div className={styles.validationError}>
        <FormattedMessage
          {...stakeValidationMSG.hasInactiveTokens}
          values={{
            a: (chunks) => (
              <a
                href={INACTIVE_TOKEN_HELP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {chunks}
              </a>
            ),
          }}
        />
      </div>
    )}
    {userActivatedTokens.lt(decimalAmount) && (
      <div className={styles.validationError}>
        <FormattedMessage
          {...stakeValidationMSG.notEnoughTokens}
          values={{
            a: (chunks) => (
              <a
                href={NOT_ENOUGH_TOKENS_HELP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {chunks}
              </a>
            ),
          }}
        />
      </div>
    )}
  </>
);

StakingValidationError.displayName = displayName;

export default StakingValidationError;
