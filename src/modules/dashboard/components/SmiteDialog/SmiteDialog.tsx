import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { bigNumberify } from 'ethers/utils';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import { useMembersSubscription } from '~data/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
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
  user: { profile: { walletAddress: Address } };
  amount: number;
  annotation: string;
  motionDomainId: string;
}

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    ethDomainId?: number;
  };

const displayName = 'dashboard.SmiteDialog';

const SmiteDialog = ({
  colony: { colonyAddress, colonyName },
  colony,
  isVotingExtensionEnabled,
  callStep,
  prevStep,
  cancel,
  close,
  ethDomainId,
}: Props) => {
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
      .moreThan(0, () => MSG.amountZero)
      .max(userReputation),
    annotation: yup.string().max(4000),
    forceAction: yup.boolean(),
    motionDomainId: yup.number(),
  });

  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  const transform = useCallback(
    pipe(
      mapPayload(({ amount, domainId, annotation, user, motionDomainId }) => {
        const totalReputation = bigNumberify(totalReputationData || '0');
        const reputationChangeAmount = totalReputation
          .mul(amount * 100)
          .div(10000);

        return {
          colonyAddress,
          colonyName,
          domainId,
          userAddress: user.profile.walletAddress,
          annotationMessage: annotation,
          amount: String(reputationChangeAmount.mul(-1)),
          motionDomainId,
        };
      }),
      withMeta({ history }),
    ),
    [totalReputationData],
  );

  return (
    <ActionForm
      initialValues={{
        forceAction: false,
        domainId: (ethDomainId === 0 || ethDomainId === undefined
          ? ROOT_DOMAIN_ID
          : ethDomainId
        ).toString(),
        user: undefined,
        amount: undefined,
        annotation: undefined,
        motionDomainId: ROOT_DOMAIN_ID,
      }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      validationSchema={validationSchema}
      onSuccess={close}
      transform={transform}
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
              updateReputation={updateReputationCallback}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

SmiteDialog.displayName = displayName;

export default SmiteDialog;
