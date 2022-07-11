import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { ActionTypes } from '~redux/actionTypes';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import { Colony } from '~data/index';
import EditExpenditureDialogForm from './EditExpenditureDialogForm';

export const MSG = defineMessages({
  header: {
    id: 'dashboard.EditConfirmDialog.header',
    defaultMessage: 'Create a motion to edit payment',
  },
  headerForce: {
    id: 'dashboard.EditConfirmDialog.headerForce',
    defaultMessage: 'Create a motion to edit expenditure',
  },
  force: {
    id: 'dashboard.EditConfirmDialog.force',
    defaultMessage: 'Force',
  },
  team: {
    id: 'dashboard.EditConfirmDialog.team',
    defaultMessage: 'Motion will be created in ',
  },
  descriptionText: {
    id: 'dashboard.EditConfirmDialog.descriptionText',
    defaultMessage: `Payment is currently at the locked stage.
    Any edits require at this point an action to be made.
    You can either enforce permission,
    or create a motion to get collective approval.`,
  },
  newRecipient: {
    id: 'dashboard.EditConfirmDialog.newRecipient',
    defaultMessage: 'New recipient',
  },
  newAmount: {
    id: 'dashboard.EditConfirmDialog.newAmount',
    defaultMessage: 'New amount',
  },
  newClaimDelay: {
    id: 'dashboard.EditConfirmDialog.newClaimDelay',
    defaultMessage: 'New claim delay',
  },
  descriptionLabel: {
    id: 'dashboard.EditConfirmDialog.descriptionLabel',
    defaultMessage: 'Explain why youre changing the payment (optional)',
  },
  cancelText: {
    id: 'dashboard.EditConfirmDialog.cancelText',
    defaultMessage: 'Back',
  },
  confirmText: {
    id: 'dashboard.EditConfirmDialog.confirmText',
    defaultMessage: 'Create motion',
  },
  confirmTexForce: {
    id: 'dashboard.EditConfirmDialog.confirmTexForce',
    defaultMessage: 'Force change',
  },
  textareaLabel: {
    id: 'dashboard.EditConfirmDialog.textareaLabel',
    defaultMessage: 'Explain why you`re changing the payment (optional)',
  },
  forceTextareaLabel: {
    id: 'dashboard.EditConfirmDialog.textareaLabel',
    defaultMessage: 'Explain why you`re changing the expenditure',
  },
  errorAnnotation: {
    id: 'dashboard.EditConfirmDialog.errorAnnotation',
    defaultMessage: 'Annotation is required',
  },
  change: {
    id: 'dashboard.EditConfirmDialog.change',
    defaultMessage: 'Change',
  },
  new: {
    id: 'dashboard.EditConfirmDialog.new',
    defaultMessage: 'New',
  },
  discard: {
    id: 'dashboard.EditConfirmDialog.discard',
    defaultMessage: 'Discard',
  },
  removed: {
    id: 'dashboard.EditConfirmDialog.removed',
    defaultMessage: 'Recipient has been deleted',
  },
  removedDelay: {
    id: 'dashboard.EditConfirmDialog.removedDelay',
    defaultMessage: 'Removed claim delay',
  },
  teamCaption: {
    id: 'dashboard.EditConfirmDialog.teamCaption',
    defaultMessage: 'Team',
  },
});

export const validationSchema = (annotationErrorMessage) =>
  yup.object().shape({
    forceAction: yup.bool(),
    // eslint-disable-next-line func-names
    annotationMessage: yup
      .string()
      .test('isRequired', annotationErrorMessage, function (value) {
        const isRequired = this?.parent?.forceAction;
        if (isRequired) {
          return !!value;
        }
        return true;
      }),
  });

export interface FormValuesType {
  forceAction: boolean;
  annotation?: string;
}

type Props = {
  onClick: (
    values: Partial<ValuesType> | undefined,
    wasForced: boolean,
  ) => void;
  close: () => void;
  isVotingExtensionEnabled: boolean;
  colony: Colony;
  newValues?: Partial<ValuesType>;
  oldValues: ValuesType;
};

const EditExpenditureDialog = ({
  close,
  onClick,
  isVotingExtensionEnabled,
  colony,
  newValues,
  oldValues,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const [domainID, setDomainID] = useState<number>();
  const [confirmedValues, setConfirmedValues] = useState(newValues);

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setDomainID(motionDomainId),
    [],
  );

  const discardChange = useCallback(
    (name: keyof ValuesType) => {
      if (confirmedValues && !(name in confirmedValues)) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name]: removedProperty, ...updatedValues } =
        confirmedValues || {};

      setConfirmedValues(updatedValues);
    },
    [confirmedValues],
  );

  const discardRecipientChange = useCallback((id: string) => {
    setConfirmedValues((confirmedVal) => {
      const newRecipients = confirmedVal?.recipients?.filter(
        (recipient) => recipient.id !== id,
      );

      if (newRecipients?.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { recipients: rec, ...updatedValues } = confirmedVal || {};

        return updatedValues;
      }
      const newVal = {
        ...confirmedVal,
        recipients: newRecipients,
      };

      return newVal;
    });
  }, []);

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
    <EditExpenditureDialogForm
      {...{
        close,
        handleMotionDomainChange,
        colony,
        confirmedValues,
        discardChange,
        discardRecipientChange,
        getFormAction,
        isForce,
        oldValues,
        onClick,
        setIsForce,
        domainID,
      }}
    />
  );
};

export default EditExpenditureDialog;
