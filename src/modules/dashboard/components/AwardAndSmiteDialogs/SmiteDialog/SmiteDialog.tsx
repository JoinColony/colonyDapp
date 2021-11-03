import React, {useState, useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router';

import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';

import DialogForm, {
  AwardAndSmiteDialogProps,
  AwardAndSmiteDialogFormValues,
  AwardAndSmiteFormValidationSchema,
} from '../AwardAndSmiteDialogForm';


const MSG = defineMessages({
  title: {
    id: 'dashboard.SmiteDialog.title',
    defaultMessage: 'Smite',
  },
  team: {
    id: 'dashboard.SmiteDialog.team',
    defaultMessage: 'Team in which Reputation should be deducted',
  },
  recipient: {
    id: 'dashboard.SmiteDialog.recipient',
    defaultMessage: 'Recipient',
  },
  amount: {
    id: 'dashboard.SmiteDialog.amount',
    defaultMessage: 'Amount of reputation points to deduct',
  },
  annotation: {
    id: 'dashboard.SmiteDialog.annotation',
    defaultMessage: "Explain why you're smiting the user (optional)",
  },
  userPickerPlaceholder: {
    id: 'dashboard.SmiteDialog.userPickerPlaceholder',
    defaultMessage: 'Search for a user or paste wallet address',
  },
  noPermission: {
    id: 'dashboard.SmiteDialog.noPermission',
    defaultMessage: `You need the {roleRequired} permission in {domain} to take this action.`,
  },
  maxReputation: {
    id: 'dashboard.SmiteDialog.maxReputation',
    defaultMessage:
      'max: {userReputationAmount} pts ({userPercentageReputation}%)',
  },
});

const displayName = 'dashboard.SmiteDialog';

const SmiteDialog = ({
  colony: { colonyAddress },
  colony,
  isVotingExtensionEnabled,
  callStep,
  prevStep,
  cancel,
  close,
  ethDomainId,
}: AwardAndSmiteDialogProps) => {
  const [isForce, setIsForce] = useState(false);
  const [totalReputationData, setTotalReputationData] = useState<
    string | undefined
  >(undefined);
  const [userReputation, setUserReputation] = useState(0);
  const history = useHistory();
  
  const updateReputationCallback = (
    userRepPercentage: number,
    totalRep?: string,
  ) => {
    setTotalReputationData(totalRep);
    setUserReputation(userRepPercentage);
  };

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_MOTION_MANAGE_REPUTATION${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_MANAGE_REPUTATION${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const smiteAmountSchema = yup
    .object()
    .shape({ amount: yup.number().max(userReputation) })
    .required();
  const validationSchema = AwardAndSmiteFormValidationSchema.concat(
    smiteAmountSchema,
  );

  return (
    <ActionForm
      initialValues={{
        domainId: (ethDomainId === 0 || ethDomainId === undefined
          ? ROOT_DOMAIN_ID
          : ethDomainId
        ).toString(),
        user: undefined,
        amount: undefined,
        annotation: undefined,
      }}
      submit={ActionTypes.COLONY_ACTION_GENERIC}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
      validationSchema={validationSchema}
      onSuccess={close}
    >
      {(formValues: FormikProps<AwardAndSmiteDialogFormValues>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...formValues}
              colony={colony}
              isVotingExtensionEnabled={isVotingExtensionEnabled}
              back={() => callStep(prevStep)}
              ethDomainId={ethDomainId}
              updateReputation={updateReputationCallback}
              formMSG={MSG}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

SmiteDialog.displayName = displayName;

export default SmiteDialog;
