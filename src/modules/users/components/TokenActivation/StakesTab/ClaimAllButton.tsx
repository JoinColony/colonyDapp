import { bigNumberify } from 'ethers/utils';
import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import { ParsedMotionStakedEvent } from '~data/generated';
import { ActionTypes } from '~redux/actionTypes';
import { Address } from '~types/index';
import { mapPayload } from '~utils/actions';

const displayName = 'TokenActivation.StakesTab.ClaimAllButton';

const MSG = defineMessages({
  claimAll: {
    id: `TokenActivation.StakesTab.ClaimAllButton.claimAll`,
    defaultMessage: 'Claim all',
  },
});

interface Props {
  unclaimedMotionStakeEvents: ParsedMotionStakedEvent[];
  colonyAddress: Address;
  userAddress: Address;
}

const ClaimAllButton = ({
  unclaimedMotionStakeEvents,
  userAddress,
  colonyAddress,
}: Props) => {
  const uniqueMotionIds = [
    ...new Set(
      unclaimedMotionStakeEvents.map(
        (motionStakeEvent) => motionStakeEvent.values.motionId,
      ),
    ),
  ];
  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      userAddress,
      motionIds: uniqueMotionIds.map((motionId) => bigNumberify(motionId)),
    })),
    [],
  );

  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.COLONY_MOTION_CLAIM}
      error={ActionTypes.COLONY_MOTION_CLAIM_ERROR}
      success={ActionTypes.COLONY_MOTION_CLAIM_SUCCESS}
      transform={transform}
    >
      {({ handleSubmit, isSubmitting }: FormikProps<{}>) => (
        <Button
          appearance={{ theme: 'primary', size: 'medium' }}
          text={MSG.claimAll}
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      )}
    </ActionForm>
  );
};

export default ClaimAllButton;

ClaimAllButton.displayName = displayName;
