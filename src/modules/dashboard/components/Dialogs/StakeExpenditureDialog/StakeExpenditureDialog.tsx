import React, { useCallback, useState } from 'react';

import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/actionTypes';

import StakeExpenditureDialogForm from './StakeExpenditureDialogForm';

const displayName = 'dashboard.StakeExpenditureDialog';

type Props = {
  onClick: () => void;
  close: () => void;
  isVotingExtensionEnabled: boolean;
};

const StakeExpenditureDialog = ({
  onClick,
  close,
  isVotingExtensionEnabled,
}: Props) => {
  const [isForce, setIsForce] = useState(false);

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  return (
    <ActionForm
      initialValues={{ forceAction: false }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
    >
      <StakeExpenditureDialogForm
        {...{
          close,
          isForce,
          onClick,
          setIsForce,
        }}
      />
    </ActionForm>
  );
};

StakeExpenditureDialog.displayName = displayName;

export default StakeExpenditureDialog;
