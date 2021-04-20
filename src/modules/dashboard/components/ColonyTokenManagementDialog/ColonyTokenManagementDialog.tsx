import React, { useCallback } from 'react';
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

const updateTokensAction = {
  submit: ActionTypes.COLONY_ACTION_EDIT_COLONY,
  error: ActionTypes.COLONY_ACTION_EDIT_COLONY_ERROR,
  success: ActionTypes.COLONY_ACTION_EDIT_COLONY_SUCCESS,
};

export interface FormValues {
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
  },
  colony: { tokens = [], nativeTokenAddress },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
  isVotingExtensionEnabled,
}: Props) => {
  const history = useHistory();
  const { formatMessage } = useIntl();

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
        annotationMessage,
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
        tokenAddress: undefined,
        selectedTokenAddresses: tokens.map((token) => token.address),
        annotationMessage: undefined,
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <TokenEditDialog
            {...formValues}
            colony={colony}
            back={prevStep && callStep ? () => callStep(prevStep) : undefined}
            tokensList={getTokenList}
            close={close}
            isVotingExtensionEnabled={isVotingExtensionEnabled}
          />
        </Dialog>
      )}
    </Form>
  );
};

ColonyTokenManagementDialog.displayName = displayName;

export default ColonyTokenManagementDialog;
