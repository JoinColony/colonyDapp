import React, { useContext } from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { TokenActivationContext } from '~users/TokenActivationProvider';
import { UniversalMessageValues, PrimitiveType } from '~types/index';

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
    defaultMessage: `Activate {leftToActivate} more {tokenSymbol} to be eligible to stake.`,
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

const displayName = 'dashboard.ActionsPage.StakingValidationError';

const StakingValidationError = ({ stakeType, errorValues }: Props) => {
  const { setIsOpen: openTokenActivationPopover } = useContext(
    TokenActivationContext,
  );

  if (stakeType === 'tokens') {
    return (
      <Button
        text={stakeValidationMSG.tokens}
        textValues={{
          /* react-intl has wrong types for the formatMessage funtion that is used in the button.
          There will be a type error if there is no type casting although it's all working correctly */
          leftToActivate: errorValues?.leftToActivate as PrimitiveType,
          tokenSymbol: (errorValues?.tokenSymbol as PrimitiveType) || '',
        }}
        appearance={{ theme: 'pink' }}
        style={{ marginTop: '20px', fontSize: '11px' }}
        onClick={() => openTokenActivationPopover(true)}
      />
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
