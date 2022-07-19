import React, { useCallback, useState } from 'react';

import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/actionTypes';
import { Colony } from '~data/index';

import EscrowFundsDialogForm from './EscrowFundsDialogForm';

const displayName = 'dashboard.EscrowFundsDialog';

export interface FormValues {
  force: boolean;
  filteredDomainId: string;
  annotationMessage?: string;
}

interface Props {
  cancel: VoidFunction;
  close: VoidFunction;
  onClick: VoidFunction;
  colony: Colony;
  isVotingExtensionEnabled: boolean;
}

const EscrowFundsDialog = ({
  cancel,
  onClick,
  close,
  colony,
  isVotingExtensionEnabled,
}: Props) => {
  const [isForce, setIsForce] = useState(false);

  const onSubmit = useCallback(() => {
    onClick();
    close();
  }, [onClick, close]);

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      // @TODO these action types are for mocking purposes, change to correct ones
      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  return (
    <Dialog cancel={cancel}>
      <ActionForm
        submit={getFormAction('SUBMIT')}
        error={getFormAction('ERROR')}
        success={getFormAction('SUCCESS')}
        initialValues={{ force: false }}
      >
        <EscrowFundsDialogForm
          {...{ colony, isForce, setIsForce, close, onSubmit }}
        />
      </ActionForm>
    </Dialog>
  );
};

EscrowFundsDialog.displayName = displayName;

export default EscrowFundsDialog;
