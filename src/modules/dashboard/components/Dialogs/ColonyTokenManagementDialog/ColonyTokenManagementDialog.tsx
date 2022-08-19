import React, { useCallback, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { AddressZero } from 'ethers/constants';
import { FormikProps, FormikHelpers } from 'formik';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import TokenEditDialog from '~core/TokenEditDialog';
import { Form } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { WizardDialogType, useAsyncFunction } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { createAddress } from '~utils/web3';

import getTokenList from './getTokenList';

const MSG = defineMessages({
  errorAddingToken: {
    id: 'core.TokenEditDialog.errorAddingToken',
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
  },
});

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const displayName = 'dashboard.ColonyTokenManagementDialog';

export interface FormValues {
  forceAction: boolean;
  tokenAddress?: Address;
  selectedTokenAddresses?: Address[];
  annotationMessage?: string;
}

const validationSchema = yup.object({
  tokenAddress: yup.string().address(),
  annotation: yup.string().max(4000),
});

const ColonyTokenManagementDialog = ({
  colony: {
    colonyAddress,
    colonyName,
    displayName: colonyDisplayName,
    avatarURL,
    avatarHash,
    whitelistedAddresses,
    isWhitelistActivated,
  },
  colony: { tokens = [], nativeTokenAddress },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const history = useHistory();
  const { formatMessage } = useIntl();

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress,
  });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`MOTION_EDIT_COLONY${actionEnd}`]
        : ActionTypes[`ACTION_EDIT_COLONY${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const updateTokensAction = {
    submit: getFormAction('SUBMIT'),
    error: getFormAction('ERROR'),
    success: getFormAction('SUCCESS'),
  };

  const transform = useCallback(
    pipe(
      mapPayload(({ tokenAddresses, annotationMessage }) => ({
        colonyAddress,
        colonyName,
        colonyDisplayName,
        colonyAvatarImage: avatarURL,
        colonyAvatarHash: avatarHash,
        hasAvatarChanged: false,
        colonyTokens: tokenAddresses,
        verifiedAddresses: whitelistedAddresses,
        annotationMessage,
        isWhitelistActivated,
      })),
      withMeta({ history }),
    ),
    [],
  );

  const updateTokens = useAsyncFunction({
    ...updateTokensAction,
    transform,
  }) as any;

  const handleSubmit = useCallback(
    async (
      {
        tokenAddress,
        selectedTokenAddresses = [],
        annotationMessage,
      }: FormValues,
      { resetForm, setSubmitting, setFieldError }: FormikHelpers<FormValues>,
    ) => {
      let addresses = selectedTokenAddresses;
      if (tokenAddress && !selectedTokenAddresses.includes(tokenAddress)) {
        addresses.push(tokenAddress);
      }
      addresses = [
        ...new Set(
          addresses
            .map((address) => createAddress(address))
            .filter((address) => {
              if (address === AddressZero || address === nativeTokenAddress) {
                return false;
              }
              return true;
            }),
        ),
      ];
      try {
        await updateTokens({ tokenAddresses: addresses, annotationMessage });
        resetForm();
        close();
      } catch (e) {
        setFieldError('tokenAddress', formatMessage(MSG.errorAddingToken));
        setSubmitting(false);
      }
    },
    [updateTokens, formatMessage, close, nativeTokenAddress],
  );

  return (
    <Form
      initialValues={{
        forceAction: false,
        tokenAddress: undefined,
        selectedTokenAddresses: tokens.map((token) => token.address),
        annotationMessage: undefined,
        /*
         * @NOTE That since this a root motion, and we don't actually make use
         * of the motion domain selected (it's disabled), we don't need to actually
         * pass the value over to the motion, since it will always be 1
         */
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {(formValues: FormikProps<FormValues>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <TokenEditDialog
              {...formValues}
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              tokensList={getTokenList}
              close={close}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

ColonyTokenManagementDialog.displayName = displayName;

export default ColonyTokenManagementDialog;
