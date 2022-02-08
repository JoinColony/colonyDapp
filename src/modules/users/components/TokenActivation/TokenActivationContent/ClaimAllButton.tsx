import { bigNumberify } from 'ethers/utils';
import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/actionTypes';
import { Address } from '~types/index';
import { mapPayload } from '~utils/actions';

const displayName =
  'users.TokenActivation.TokenActivationContent.ClaimsTab.ClaimAllButton';

const MSG = defineMessages({
  claimAll: {
    id: `users.TokenActivation.TokenActivationContent.ClaimsTab.ClaimAllButton.claimAll`,
    defaultMessage: 'Claim all',
  },
});

interface Props {
  motionIds: number[];
  colonyAddress: Address;
  userAddress: Address;
}

const ClaimAllButton = ({ motionIds, userAddress, colonyAddress }: Props) => {
  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      userAddress,
      motionIds: motionIds.map((motionId) => bigNumberify(motionId)),
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
          appearance={{ theme: 'primary', size: 'large' }}
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
