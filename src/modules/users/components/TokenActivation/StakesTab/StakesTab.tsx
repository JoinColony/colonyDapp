import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/index';
import { SpinnerLoader } from '~core/Preloaders';
import { ClaimableStakedMotionsQuery, UserToken } from '~data/generated';
import { getFormattedTokenValue } from '~utils/tokens';

import StakesListItem from './StakesListItem';

import styles from './StakesTab.css';

const MSG = defineMessages({
  yourStakes: {
    id: 'users.TokenActivation.TokenActivationContent.StakesTab.yourStakes',
    defaultMessage: 'Your stakes',
  },
  noClaims: {
    id: 'users.TokenActivation.TokenActivationContent.ClaimsTab.noClaims',
    defaultMessage: 'There are no stakes to claim.',
  },
  buttonText: {
    id: 'users.TokenActivation.TokenActivationContent.StakesTab.buttonText',
    defaultMessage: 'Claim all',
  },
});

export interface StakesTabProps {
  unclaimedMotions: ClaimableStakedMotionsQuery | undefined;
  loading: boolean;
  token: UserToken;
}

const StakesTab = ({ unclaimedMotions, loading, token }: StakesTabProps) => {
  const getStakedAmount = (stakeAmount: number, userToken: UserToken) => {
    return getFormattedTokenValue(stakeAmount, userToken.decimals);
  };

  const claimableStakedMotions = unclaimedMotions?.claimableStakedMotions;

  return (
    <div className={styles.container}>
      <ActionForm
        initialValues={{}}
        submit={ActionTypes.COLONY_MOTION_CLAIM}
        error={ActionTypes.COLONY_MOTION_CLAIM_ERROR}
        success={ActionTypes.COLONY_MOTION_CLAIM_SUCCESS}
      >
        <div className={styles.claimStakesContainer}>
          <FormattedMessage {...MSG.yourStakes} />
          <Button
            appearance={{ theme: 'primary', size: 'medium' }}
            text={MSG.buttonText}
            // onClick=
          />
        </div>
      </ActionForm>
      {loading ? (
        <div className={styles.loader}>
          <SpinnerLoader appearance={{ size: 'medium' }} />
        </div>
      ) : (
        <div>
          {unclaimedMotions &&
          unclaimedMotions.claimableStakedMotions?.claimableStakedMotions
            .length > 0 ? (
            <ul>
              {claimableStakedMotions?.claimableStakedMotions.map(
                (motion, id) => (
                  <StakesListItem
                    stakedAmount={getStakedAmount(motion.stakedAmount, token)}
                    tokenSymbol={token.symbol}
                    colonyName=""
                    txHash=""
                    key={id}
                  />
                ),
              )}
            </ul>
          ) : (
            <div className={styles.noClaims}>
              <FormattedMessage {...MSG.noClaims} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StakesTab;
