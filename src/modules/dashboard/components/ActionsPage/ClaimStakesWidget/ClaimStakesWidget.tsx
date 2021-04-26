import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { defineMessages, FormattedMessage } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Button from '~core/Button';
import { ActionForm, CustomRadioGroup, CustomRadioProps } from '~core/Fields';
import Heading from '~core/Heading';

import { Colony, useLoggedInUser, useUserReputationQuery } from '~data/index';
import { ActionTypes } from '~redux/index';
import { ColonyMotions } from '~types/index';
import { mapPayload } from '~utils/actions';

import styles from './ClaimStakesWidget.css';

export interface FormValues {
  vote: string;
}

interface Props {
  colony: Colony;
  actionType: string;
  motionId: number;
  motionDomain?: number;
}

const MSG = defineMessages({
  title: {
    id: 'dashboard.ActionsPage.ClaimStakesWidget.title',
    defaultMessage: `Claim your tokens`,
  },
  buttonClaim: {
    id: 'dashboard.ActionsPage.ClaimStakesWidget.buttonClaim',
    defaultMessage: `Claim`,
  },
  stake: {
    id: 'dashboard.ActionsPage.ClaimStakesWidget.stake',
    defaultMessage: `Stake`,
  },
  winnings: {
    id: 'dashboard.ActionsPage.ClaimStakesWidget.winnings',
    defaultMessage: `Winnings`,
  },
  total: {
    id: 'dashboard.ActionsPage.ClaimStakesWidget.total',
    defaultMessage: `Total`,
  },
});

const ClaimStakesWidget = ({
  colony: { colonyAddress },
  colony,
}: // actionType,
// motionId,
// motionDomain = ROOT_DOMAIN_ID,
Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const hasRegisteredProfile = !!username && !ethereal;

  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.COLONY_ACTION_GENERIC}
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
      // transform={transform}
    >
      {({
        handleSubmit,
        isSubmitting,
        isValid,
        values,
      }: FormikProps<FormValues>) => (
        <div className={styles.main}>
          <div className={styles.title}>
            <div className={styles.label}>
              <div>
                <FormattedMessage {...MSG.title} />
              </div>
            </div>
            <div className={styles.value}>
              <Button
                appearance={{ theme: 'primary', size: 'medium' }}
                text={MSG.buttonClaim}
                disabled={!isValid || !hasRegisteredProfile}
                onClick={() => handleSubmit()}
                loading={isSubmitting}
              />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>
              <div>
                <FormattedMessage {...MSG.stake} />
              </div>
            </div>
            <div className={styles.value}>12 A</div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>
              <div>
                <FormattedMessage {...MSG.winnings} />
              </div>
            </div>
            <div className={styles.value}>12 A</div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>
              <div>
                <FormattedMessage {...MSG.total} />
              </div>
            </div>
            <div className={styles.value}>12 A</div>
          </div>
        </div>
      )}
    </ActionForm>
  );
};

ClaimStakesWidget.displayName = 'dashboard.ActionsPage.ClaimStakesWidget';

export default ClaimStakesWidget;
