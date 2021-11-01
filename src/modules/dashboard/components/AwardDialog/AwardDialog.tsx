import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Decimal from 'decimal.js';

import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import DialogForm, {
  AwardAndSmiteDialogProps,
  AwardAndSmiteDialogFormValues,
  AwardAndSmiteFormValidationSchema,
} from '../AwardAndSmiteDialogForm';

const displayName = 'dashboard.AwardDialog';

const MSG = defineMessages({
  title: {
    id: 'dashboard.AwardDialog.title',
    defaultMessage: 'Award',
  },
  team: {
    id: 'dashboard.AwardDialog.team',
    defaultMessage: 'Team in which Reputation should be awarded',
  },
  recipient: {
    id: 'dashboard.AwardDialog.recipient',
    defaultMessage: 'Recipient',
  },
  amount: {
    id: 'dashboard.AwardDialog.amount',
    defaultMessage: 'Amount of reputation points to award',
  },
  annotation: {
    id: 'dashboard.AwardDialog.annotation',
    defaultMessage: "Explain why you're awarding the user (optional)",
  },
  userPickerPlaceholder: {
    id: 'dashboard.AwardDialog.userPickerPlaceholder',
    defaultMessage: 'Search for a user or paste wallet address',
  },
  noPermission: {
    id: 'dashboard.AwardDialog.noPermission',
    defaultMessage: `You need the {roleRequired} permission in {domain} to take this action.`,
  },
  maxReputation: {
    id: 'dashboard.AwardDialog.maxReputation',
    defaultMessage: '{userReputationAmount} pts ({userPercentageReputation}%)',
  },
});

const AwardDialog = ({
  colony: { colonyAddress, colonyName, tokens, nativeTokenAddress },
  colony,
  isVotingExtensionEnabled,
  callStep,
  prevStep,
  cancel,
  close,
  ethDomainId,
}: AwardAndSmiteDialogProps) => {
  const [isForce, setIsForce] = useState(false);
  const history = useHistory();

  const nativeToken = tokens.find(
    (token) => token.address === nativeTokenAddress,
  );
  const nativeTokenDecimals = nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS;

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_MOTION_AWARD${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_AWARD${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

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
        };
      }),
      withMeta({ history }),
    ),
    [],
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
      validationSchema={AwardAndSmiteFormValidationSchema}
      onSuccess={close}
      transform={transform}
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
              nativeTokenDecimals={nativeTokenDecimals}
              isVotingExtensionEnabled={isVotingExtensionEnabled}
              back={() => callStep(prevStep)}
              ethDomainId={ethDomainId}
              formMSG={MSG}
              isAwardingReputation
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

AwardDialog.displayName = displayName;

export default AwardDialog;
