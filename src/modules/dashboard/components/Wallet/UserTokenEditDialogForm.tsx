import React, { useCallback, useState, useMemo } from 'react';
import { FormikProps, FormikHelpers } from 'formik';
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
import TokenItem from '~core/TokenEditDialog/TokenItem/index';

import { UserTokens, OneToken, useLoggedInUser } from '~data/index';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';

import styles from './UserTokenEditDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Wallet.UserTokenEditDialogForm.title',
    defaultMessage: 'Manage tokens',
  },
  errorAddingToken: {
    id: 'dashboard.Wallet.UserTokenEditDialogForm.errorAddingToken',
    defaultMessage: `Sorry, there was an error adding this token. Learn more about tokens at: https://colony.io.`,
  },
  fieldLabel: {
    id: 'dashboard.Wallet.UserTokenEditDialogForm.fieldLabel',
    defaultMessage: 'Contract address',
  },
  noTokensText: {
    id: 'dashboard.Wallet.UserTokenEditDialogForm.noTokensText',
    defaultMessage: `It looks no tokens have been added yet. Get started using the form above.`,
  },
  notListedToken: {
    id: 'dashboard.Wallet.UserTokenEditDialogForm.notListedToken',
    defaultMessage: `If token is not listed above, please add any ERC20 compatibile token contract address below.`,
  },
  notRegisteredUser: {
    id: 'dashboard.Wallet.UserTokenEditDialogForm.notRegisteredUser',
    defaultMessage: `Please sign in or register to edit tokens`,
  },
});

const displayName = 'dashboard.Wallet.UserTokenEditDialogForm';

interface Props {
  updateTokens: (payload: { tokenAddresses: Address[] }) => Promise<any>;
  cancel: () => void;
  close: () => void;
  tokensList: UserTokens;
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
}: Props) => {
  const { username, ethereal } = useLoggedInUser();

  const [tokenData, setTokenData] = useState<OneToken | undefined>();
  const [tokenSelectorHasError, setTokenSelectorHasError] = useState<boolean>(
    true,
  );
  const [isCheckingAddress, setIsCheckingAddress] = useState<boolean>(false);
  const { formatMessage } = useIntl();

  const sortedTokenIds = useMemo(
    () => tokensList.map((token) => token.id).sort(),
    [tokensList],
  );

  const handleTokenSelect = (checkingAddress: boolean, token: OneToken) => {
    setTokenData(token);
    setIsCheckingAddress(checkingAddress);
  };

  const handleTokenSelectError = (hasError: boolean) => {
    setTokenSelectorHasError(hasError);
  };

  const hasTokensListChanged = ({
    selectedTokenAddresses,
    tokenAddress,
  }: FormValues) =>
    !!tokenAddress || !isEqual(sortedTokenIds, selectedTokenAddresses?.sort());

  const handleSubmit = useCallback(
    async (
      { tokenAddress, selectedTokenAddresses = [] }: FormValues,
      { resetForm, setSubmitting, setFieldError }: FormikHelpers<FormValues>,
    ) => {
      let addresses = selectedTokenAddresses;
      if (tokenAddress && !selectedTokenAddresses.includes(tokenAddress)) {
        addresses.push(createAddress(tokenAddress));
      }
      addresses = [
        ...new Set(addresses.filter((address) => address !== AddressZero)),
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
    [updateTokens, formatMessage, close],
  );

  const hasRegisteredProfile = !!username && !ethereal;

  const tokens = useMemo(() => [...(hasRegisteredProfile ? tokensList : [])], [
    tokensList,
    hasRegisteredProfile,
  ]);

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ margin: 'none', size: 'medium', theme: 'dark' }}
          text={MSG.title}
        />
      </DialogSection>

      <Form
        initialValues={{
          tokenAddress: undefined,
          selectedTokenAddresses: tokensList.map((token) => token.address),
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
      >
        {({ isSubmitting, isValid, values }: FormikProps<FormValues>) => (
          <>
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              {tokens.length > 0 ? (
                <div className={styles.tokenChoiceContainer}>
                  {tokens.map((token) => (
                    <TokenItem
                      key={token.address}
                      token={token}
                      disabled={
                        !hasRegisteredProfile || token.address === AddressZero
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
                onTokenSelect={handleTokenSelect}
                onTokenSelectError={handleTokenSelectError}
                tokenData={tokenData}
                label={MSG.fieldLabel}
                appearance={{ colorSchema: 'grey', theme: 'fat' }}
                disabled={!hasRegisteredProfile || isSubmitting}
              />
            </DialogSection>
            {!hasRegisteredProfile && (
              <DialogSection appearance={{ theme: 'sidePadding' }}>
                <div className={styles.noPermissionMessage}>
                  <FormattedMessage {...MSG.notRegisteredUser} />
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
                  !hasTokensListChanged(values) ||
                  isSubmitting ||
                  isCheckingAddress
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

UserTokenEditDialogForm.displayName = displayName;

export default UserTokenEditDialogForm;
