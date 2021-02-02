import React, { useCallback, useState, useMemo } from 'react';
import { FormikProps, FormikHelpers } from 'formik';
import { ColonyRole } from '@colony/colony-js';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';
import { AddressZero } from 'ethers/constants';
import isEqual from 'lodash/isEqual';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { Form } from '~core/Fields';
import Heading from '~core/Heading';
import Paragraph from '~core/Paragraph';
import TokenSelector from '~dashboard/CreateColonyWizard/TokenSelector';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import PermissionsLabel from '~core/PermissionsLabel';
import TokenItem from '~core/TokenEditDialog/TokenItem/index';

import { AnyToken, OneToken, useLoggedInUser, Colony } from '~data/index';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';

import styles from './UserTokenEditDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.UserTokenEditDialog.UserTokenEditDialogForm.title',
    defaultMessage: 'Manage tokens',
  },
  errorAddingToken: {
    id:
      'dashboard.UserTokenEditDialog.UserTokenEditDialogForm.errorAddingToken',
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
  },
  fieldLabel: {
    id: 'dashboard.UserTokenEditDialog.UserTokenEditDialogForm.fieldLabel',
    defaultMessage: 'Contract address',
  },
  textareaLabel: {
    id: 'dashboard.UserTokenEditDialog.UserTokenEditDialogForm.textareaLabel',
    defaultMessage: 'Explain why you’re making these changes (optional)',
  },
  noTokensText: {
    id: 'dashboard.UserTokenEditDialog.UserTokenEditDialogForm.noTokensText',
    defaultMessage: `It looks no tokens have been added yet. Get started using the form above.`,
  },
  notListedToken: {
    id: 'dashboard.UserTokenEditDialog.UserTokenEditDialogForm.notListedToken',
    defaultMessage: `If token is not listed above, please add any ERC20 compatibile token contract address below.`,
  },
  noPermission: {
    id: 'dashboard.UserTokenEditDialog.UserTokenEditDialogForm.noPermission',
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
});

interface Props {
  updateTokens: (payload: { tokenAddresses: Address[] }) => Promise<any>;
  cancel: () => void;
  close: () => void;
  // Token list from json file. Not supported on local env
  tokensList?: AnyToken[];
  colony: Colony;
}

interface FormValues {
  tokenAddress?: Address;
  selectedTokenAddresses?: Address[];
}

const validationSchema = yup.object({
  tokenAddress: yup.string().address(),
});

const UserTokenEditDialogForm = ({
  updateTokens,
  cancel,
  close,
  tokensList = [],
  colony,
}: Props) => {
  const { username, ethereal } = useLoggedInUser();
  const tokens = colony?.tokens || [];
  const nativeTokenAddress = colony?.nativeTokenAddress;
  const tokenAddresses = colony?.tokenAddresses || [];

  const [tokenData, setTokenData] = useState<OneToken | undefined>();
  const [tokenSelectorHasError, setTokenSelectorHasError] = useState<boolean>(
    false,
  );
  const { formatMessage } = useIntl();

  const handleTokenSelect = (token: OneToken) => {
    setTokenData(token);
  };

  const handleTokenSelectError = (hasError: boolean) => {
    setTokenSelectorHasError(hasError);
  };

  const hasTokensListChanged = ({
    selectedTokenAddresses,
    tokenAddress,
  }: FormValues) =>
    !!tokenAddress ||
    !isEqual(
      [AddressZero, ...tokenAddresses].sort(),
      selectedTokenAddresses?.sort(),
    );

  const handleSubmit = useCallback(
    async (
      { tokenAddress, selectedTokenAddresses = [] }: FormValues,
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
        await updateTokens({
          tokenAddresses: addresses,
        });
        resetForm();
        close();
      } catch (e) {
        setFieldError('tokenAddress', formatMessage(MSG.errorAddingToken));
        setSubmitting(false);
      }
    },
    [updateTokens, formatMessage, close, nativeTokenAddress],
  );

  const hasRegisteredProfile = !!username && !ethereal;
  const requiredRoles: ColonyRole[] = [ColonyRole.Root];

  const allTokens = useMemo(() => {
    return [...tokens, ...(hasRegisteredProfile ? tokensList : [])].filter(
      ({ address: firstTokenAddress }, index, mergedTokens) =>
        mergedTokens.findIndex(
          ({ address: secondTokenAddress }) =>
            secondTokenAddress === firstTokenAddress,
        ) === index,
    );
  }, [tokens, tokensList, hasRegisteredProfile]);

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}
          text={MSG.title}
        />
      </DialogSection>
      {!hasRegisteredProfile && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <Form
        initialValues={{
          tokenAddress: undefined,
          selectedTokenAddresses: tokens.map((token) => token.address),
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
      >
        {({ isSubmitting, isValid, values }: FormikProps<FormValues>) => (
          <>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              {allTokens.length > 0 ? (
                <div className={styles.tokenChoiceContainer}>
                  {allTokens.map((token) => (
                    <TokenItem
                      key={token.address}
                      token={token}
                      disabled={
                        !hasRegisteredProfile ||
                        token.address === nativeTokenAddress ||
                        token.address === AddressZero
                      }
                    />
                  ))}
                </div>
              ) : (
                <Heading
                  appearance={{ size: 'normal' }}
                  text={MSG.noTokensText}
                />
              )}
            </DialogSection>
            <DialogSection>
              <Paragraph className={styles.description}>
                <FormattedMessage {...MSG.notListedToken} />
              </Paragraph>
              <TokenSelector
                tokenAddress={values.tokenAddress as string}
                onTokenSelect={(token: OneToken) => handleTokenSelect(token)}
                onTokenSelectError={handleTokenSelectError}
                tokenData={tokenData}
                label={MSG.fieldLabel}
                appearance={{ colorSchema: 'grey', theme: 'fat' }}
                disabled={!hasRegisteredProfile}
              />
            </DialogSection>
            {!hasRegisteredProfile && (
              <DialogSection appearance={{ theme: 'sidePadding' }}>
                <div className={styles.noPermissionMessage}>
                  <FormattedMessage
                    {...MSG.noPermission}
                    values={{
                      roleRequired: (
                        <PermissionsLabel
                          permission={ColonyRole.Root}
                          name={{
                            id: `role.${ColonyRole.Root}`,
                          }}
                        />
                      ),
                    }}
                  />
                </div>
              </DialogSection>
            )}
            <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                text={{ id: 'button.cancel' }}
                onClick={close}
              />
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                text={{ id: 'button.confirm' }}
                loading={isSubmitting}
                disabled={
                  tokenSelectorHasError ||
                  !isValid ||
                  !hasRegisteredProfile ||
                  !hasTokensListChanged(values)
                }
                type="submit"
                style={{ width: styles.wideButton }}
              />
            </DialogSection>
          </>
        )}
      </Form>
    </Dialog>
  );
};

export default UserTokenEditDialogForm;
