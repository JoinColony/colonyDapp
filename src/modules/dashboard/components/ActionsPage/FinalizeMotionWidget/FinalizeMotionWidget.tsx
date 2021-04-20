import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { Colony, useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { ColonyMotions } from '~types/index';
import { mapPayload } from '~utils/actions';

import VoteResults from './VoteResults';

import styles from './FinalizeMotionWidget.css';

interface Props {
  colony: Colony;
  motionId: number;
  actionType: string;
}

const MSG = defineMessages({
  /*
   * @NOTE I didn't want to create a mapping for this, since they will only
   * be used in this instance
   *
   * If by chance we end up having to use this mapping elsewhere, feel free
   * to create it's own map
   */
  title: {
    id: 'dashboard.ActionsPage.FinalizeMotionWidget.title',
    defaultMessage: `Should "{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint tokens}
      other {Generic Action}
    }" be approved?`,
  },
  finalizeLabel: {
    id: 'dashboard.ActionsPage.FinalizeMotionWidget.finalizeLabel',
    defaultMessage: `Finalize motion`,
  },
  finalizeTooltip: {
    id: 'dashboard.ActionsPage.FinalizeMotionWidget.finalizeTooltip',
    defaultMessage: `[TO BE ADDED WHEN AVAILABLE]`,
  },
  finalizeButton: {
    id: 'dashboard.ActionsPage.FinalizeMotionWidget.finalizeButton',
    defaultMessage: `Finalize`,
  },
  outcomeCelebration: {
    id: 'dashboard.ActionsPage.FinalizeMotionWidget.outcomeCelebration',
    defaultMessage: `{outcome, select,
      true {🎉 Congratulations, your side won!}
      other {Sorry, your side lost!}
    }`,
  },
});

const FinalizeMotionWidget = ({
  colony: { colonyAddress },
  colony,
  motionId,
  actionType,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const transform = useCallback(
    mapPayload(({}) => ({
      colonyAddress,
      walletAddress,
    })),
    [],
  );

  const hasRegisteredProfile = !!username && !ethereal;

  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.COLONY_ACTION_GENERIC}
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
      transform={transform}
    >
      {({ handleSubmit, isSubmitting }: FormikProps<{}>) => (
        <div className={styles.main}>
          <div>
            <div className={styles.itemWithForcedBorder}>
              <div className={styles.label}>
                <div>
                  <FormattedMessage {...MSG.finalizeLabel} />
                  <QuestionMarkTooltip
                    tooltipText={MSG.finalizeTooltip}
                    className={styles.help}
                    tooltipClassName={styles.tooltip}
                    tooltipPopperProps={{
                      placement: 'right',
                    }}
                  />
                </div>
              </div>
              <div className={styles.value}>
                <Button
                  appearance={{ theme: 'primary', size: 'medium' }}
                  text={MSG.finalizeButton}
                  disabled={!hasRegisteredProfile}
                  onClick={() => handleSubmit()}
                  loading={isSubmitting}
                />
              </div>
            </div>
          </div>
          <div className={styles.voteResults}>
            <div className={styles.outcome}>
              <FormattedMessage
                {...MSG.outcomeCelebration}
                values={{ outcome: true }}
              />
            </div>
            <Heading
              text={MSG.title}
              textValues={{ actionType }}
              appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
            />
            <VoteResults colony={colony} motionId={motionId} />
          </div>
        </div>
      )}
    </ActionForm>
  );
};

FinalizeMotionWidget.displayName = 'dashboard.ActionsPage.FinalizeMotionWidget';

export default FinalizeMotionWidget;
