import React, { useCallback, useMemo, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { useHistory } from 'react-router-dom';
import Decimal from 'decimal.js';
import { defineMessages } from 'react-intl';

import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { ActionTypes } from '~redux/index';
import { useMembersSubscription } from '~data/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { useSelectedUser } from '~utils/hooks/useSelectedUser';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { getVerifiedUsers } from '~utils/verifiedRecipients';

import DialogForm from '../ManageReputationDialogForm';
import {
  AwardAndSmiteDialogProps,
  ManageReputationDialogFormValues,
} from '../types';

const displayName = 'dashboard.ManageReputationContainer';

const MSG = defineMessages({
  amountZero: {
    id: 'dashboard.ManageReputationContainer.amountZero',
    defaultMessage: 'Amount must be greater than zero',
  },
});

const ManageReputationContainer = ({
  colony: { colonyAddress, colonyName, tokens, nativeTokenAddress },
  colony,
  callStep,
  prevStep,
  cancel,
  close,
  ethDomainId,
  isSmiteAction = false,
}: AwardAndSmiteDialogProps) => {
  const [isForce, setIsForce] = useState(false);
  const [totalReputationData, setTotalReputationData] = useState<
    string | undefined
  >(undefined);
  const [userReputation, setUserReputation] = useState(0);
  const history = useHistory();

  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  const subscribedUsers = colonyMembers?.subscribedUsers || [];

  const verifiedUsers = useMemo(() => {
    return getVerifiedUsers(colony.whitelistedAddresses, subscribedUsers) || [];
  }, [subscribedUsers, colony]);

  const updateReputationCallback = (
    userRepPercentage: number,
    totalRep?: string,
  ) => {
    setTotalReputationData(totalRep);
    setUserReputation(userRepPercentage);
  };

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress,
  });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`MOTION_MANAGE_REPUTATION${actionEnd}`]
        : ActionTypes[`ACTION_MANAGE_REPUTATION${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const defaultValidationSchema = yup.object().shape({
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
    forceAction: yup.boolean(),
    motionDomainId: yup.number(),
  });
  let smiteValidationSchema;

  if (isSmiteAction) {
    const amountValidationSchema = yup
      .object()
      .shape({ amount: yup.number().max(userReputation) })
      .required();
    smiteValidationSchema = defaultValidationSchema.concat(
      amountValidationSchema,
    );
  }

  const nativeToken = tokens.find(
    (token) => token.address === nativeTokenAddress,
  );
  const nativeTokenDecimals = nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS;

  const transform = useCallback(
    pipe(
      mapPayload(({ amount, domainId, annotation, user, motionDomainId }) => {
        const reputationChangeAmount = new Decimal(amount)
          .mul(new Decimal(10).pow(nativeTokenDecimals))
          // Smite amount needs to be negative, otherwise leave it as it is
          .mul(isSmiteAction ? -1 : 1);

        return {
          colonyAddress,
          colonyName,
          domainId,
          userAddress: user.profile.walletAddress,
          annotationMessage: annotation,
          amount: reputationChangeAmount.toString(),
          motionDomainId,
          isSmitingReputation: isSmiteAction,
        };
      }),
      withMeta({ history }),
    ),
    [totalReputationData, isSmiteAction],
  );

  const { isWhitelistActivated } = colony;
  const selectedUser = useSelectedUser(
    isWhitelistActivated ? verifiedUsers : subscribedUsers,
  );

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
      validationSchema={smiteValidationSchema || defaultValidationSchema}
      onSuccess={close}
      transform={transform}
    >
      {(formValues: FormikProps<ManageReputationDialogFormValues>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...formValues}
              colony={colony}
              nativeTokenDecimals={nativeTokenDecimals}
              back={() => callStep(prevStep)}
              ethDomainId={ethDomainId}
              verifiedUsers={
                isWhitelistActivated ? verifiedUsers : subscribedUsers
              }
              updateReputation={
                isSmiteAction ? updateReputationCallback : undefined
              }
              isSmiteAction={isSmiteAction}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

ManageReputationContainer.displayName = displayName;

export default ManageReputationContainer;
