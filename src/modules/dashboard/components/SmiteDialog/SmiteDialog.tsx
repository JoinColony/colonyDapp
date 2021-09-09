import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import { useMembersSubscription } from '~data/index';
import { WizardDialogType } from '~utils/hooks';

import DialogForm from './SmiteDialogForm';

const MSG = defineMessages({
  amountZero: {
    id: 'dashboard.SmiteDialog.amountZero',
    defaultMessage: 'Amount must be greater than zero',
  },
});

export interface FormValues {
  forceAction: boolean;
  domainId: string;
  user: Address;
  amount: string;
  annotation: string;
}

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    ethDomainId?: number;
  };

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
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const history = useHistory();

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_MOTION_SMITE${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_SMITE${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const validationSchema = yup.object().shape({
    domainId: yup.number().required(),
    user: yup.object().shape({
      profile: yup.object().shape({
        walletAddress: yup.string().address().required(),
      }),
    }),
    amount: yup
      .number()
      .required()
      .moreThan(0, () => MSG.amountZero),
    annotation: yup.string().max(4000),
  });

  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

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
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      validationSchema={validationSchema}
      onSuccess={close}
    >
      {(formValues: FormikProps<FormValues>) => {
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
              subscribedUsers={colonyMembers?.subscribedUsers || []}
              ethDomainId={ethDomainId}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

SmiteDialog.displayName = displayName;

export default SmiteDialog;
