import React, { useCallback, useState, useMemo } from 'react';
import { FormikProps, FormikHelpers } from 'formik';
import { ColonyRole } from '@colony/colony-js';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';
import { AddressZero } from 'ethers/constants';
import isEqual from 'lodash/isEqual';

import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { Form, Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import Paragraph from '~core/Paragraph';
import TokenSelector from '~dashboard/CreateColonyWizard/TokenSelector';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import PermissionsLabel from '~core/PermissionsLabel';

import { AnyToken, OneToken, useLoggedInUser, Colony } from '~data/index';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '../../../transformers';
import { hasRoot } from '../../../users/checks';

import TokenItem from './TokenItem/index';

import styles from './TokenEditDialog.css';

const MSG = defineMessages({
  title: {
    id: 'core.TokenEditDialog.title',
    defaultMessage: 'Manage tokens',
  },
  errorAddingToken: {
    id: 'core.TokenEditDialog.errorAddingToken',
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
  },
  fieldLabel: {
    id: 'core.TokenEditDialog.fieldLabel',
    defaultMessage: 'Contract address',
  },
  textareaLabel: {
    id: 'core.TokenEditDialog.textareaLabel',
    defaultMessage: 'Explain why you’re making these changes (optional)',
  },
  noTokensText: {
    id: 'core.TokenEditDialog.noTokensText',
    defaultMessage: `It looks no tokens have been added yet. Get started using the form above.`,
  },
  notListedToken: {
    id: 'core.TokenEditDialog.notListedToken',
    defaultMessage: `If token is not listed above, please add any ERC20 compatible token contract address below.`,
  },
  noPermission: {
    id: 'core.TokenEditDialog.noPermission',
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
});

interface Props {
  updateTokens: (payload: {
    tokenAddresses: Address[];
    annotationMessage?: string;
  }) => Promise<any>;
  cancel: () => void;
  close: () => void;
  // Token list from json file. Not supported on local env
  tokensList?: AnyToken[];
  colony: Colony;
  back?: () => void;
}

interface FormValues {
  tokenAddress?: Address;
  selectedTokenAddresses?: Address[];
  annotationMessage?: string;
}

const validationSchema = yup.object({
  tokenAddress: yup.string().address(),
  annotation: yup.string().max(4000),
});

const TokenEditDialog = ({
  updateTokens,
  cancel,
  close,
  tokensList = [],
  colony: { tokens = [], nativeTokenAddress, tokenAddresses },
  colony,
  back,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

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

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const userHasPermissions = hasRegisteredProfile && hasRoot(allUserRoles);
  const requiredRoles: ColonyRole[] = [ColonyRole.Root];

  const allTokens = useMemo(() => {
    return [...tokens, ...(userHasPermissions ? tokensList : [])].filter(
      ({ address: firstTokenAddress }, index, mergedTokens) =>
        mergedTokens.findIndex(
          ({ address: secondTokenAddress }) =>
            secondTokenAddress === firstTokenAddress,
        ) === index,
    );
  }, [tokens, tokensList, userHasPermissions]);

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}
          text={MSG.title}
        />
      </DialogSection>
      {!userHasPermissions && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <Form
        initialValues={{
          tokenAddress: undefined,
          selectedTokenAddresses: tokens.map((token) => token.address),
          annotationMessage: undefined,
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
                        !userHasPermissions ||
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
                disabled={!userHasPermissions}
              />
              <div className={styles.textarea}>
                <Annotations
                  label={MSG.textareaLabel}
                  name="annotationMessage"
                  disabled={!userHasPermissions}
                />
              </div>
            </DialogSection>
            {!userHasPermissions && (
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
                text={{
                  id: back === undefined ? 'button.cancel' : 'button.back',
                }}
                onClick={back === undefined ? close : back}
              />
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                text={{ id: 'button.confirm' }}
                loading={isSubmitting}
                disabled={
                  tokenSelectorHasError ||
                  !isValid ||
                  !userHasPermissions ||
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

TokenEditDialog.displayName = 'core.TokenEditDialog';

export default TokenEditDialog;
