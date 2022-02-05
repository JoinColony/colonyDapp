import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/index';

import StakesListItem from './StakesListItem';

import styles from './StakesTab.css';
// import styles from '../TokenActivationContent.css';

const MSG = defineMessages({
  yourStakes: {
    id: 'users.TokenActivation.TokenActivationContent.StakesTab.yourStakes',
    defaultMessage: 'Your stakes',
  },
  buttonText: {
    id: 'users.TokenActivation.TokenActivationContent.StakesTab.buttonText',
    defaultMessage: 'Claim all',
  },
});

const StakesTab = () => {
  const dummyData = [1, 2, 3, 4];

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
      <ul className={styles.stakesList}>
        {dummyData.map((item) => (
          <StakesListItem item={item} />
        ))}
      </ul>
    </div>
  );
};

export default StakesTab;
