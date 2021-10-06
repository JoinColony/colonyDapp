import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Decimal from 'decimal.js';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import { useMembersSubscription } from '~data/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { WizardDialogType } from '~utils/hooks';
import { useSelectedUser } from '~utils/hooks/useSelectedUser';

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
  colony: { colonyAddress, colonyName, tokens, nativeTokenAddress },
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
        ? ActionTypes[`COLONY_MOTION_MANAGE_REPUTATION${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_MANAGE_REPUTATION${actionEnd}`];
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

  const nativeToken = tokens.find(
    (token) => token.address === nativeTokenAddress,
  );
  const nativeTokenDecimals = nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS;

  const transform = useCallback(
    pipe(
      mapPayload(({ amount, domainId, annotation, user, motionDomainId }) => {
        const reputationChangeAmount = new Decimal(amount).mul(
          new Decimal(10).pow(nativeTokenDecimals),
        );

        return {
          colonyAddress,
          colonyName,
          domainId,
          userAddress: user.profile.walletAddress,
          annotationMessage: annotation,
          amount: reputationChangeAmount.toString(),
          motionDomainId,
          isSmitingReputation: false,
        };
      }),
      withMeta({ history }),
    ),
    [totalReputationData],
  );

  const selectedUser = useSelectedUser(colonyMembers);

  return (
    <ActionForm
      initialValues={{
        forceAction: false,
        domainId: (ethDomainId === 0 || ethDomainId === undefined
          ? ROOT_DOMAIN_ID
          : ethDomainId
        ).toString(),
        user: selectedUser,
        amount: undefined,
        annotation: undefined,
        motionDomainId: ROOT_DOMAIN_ID,
      }}
      enableReinitialize
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
              nativeTokenDecimals={nativeTokenDecimals}
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
