import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import { defineMessage, FormattedMessage } from 'react-intl';
import { Redirect, RouteChildrenProps, useParams } from 'react-router-dom';
import { bigNumberify } from 'ethers/utils';

import { ActionForm } from '~core/Fields';
import Heading from '~core/Heading';

import LoadingTemplate from '~pages/LoadingTemplate';

import {
  useColonyFromNameQuery,
  useMetaColonyQuery,
  useUnwrapTokenForMetacolonyQuery,
  useLoggedInUser,
} from '~data/index';
import { ActionTypes } from '~redux/actionTypes';
import { NOT_FOUND_ROUTE } from '~routes/index';
import { mapPayload } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import VestingPageLayout from './VestingPageLayout';

import styles from './Vesting.css';

const MSG = defineMessage({
  title: {
    id: 'dashboard.Vesting.UnwrapTokensPage.title',
    defaultMessage: 'Unwrap {tokenSymbol}',
  },
  wrappedBalance: {
    id: 'dashboard.Vesting.UnwrapTokensPage.wrappedBalance',
    defaultMessage: '{tokenSymbol} balance',
  },
  balance: {
    id: 'dashboard.Vesting.UnwrapTokensPage.balance',
    defaultMessage: '{tokenSymbol} balance',
  },
  buttonUnwrap: {
    id: 'dashboard.Vesting.UnwrapTokensPage.buttonUnwrap',
    defaultMessage: 'Unwrap {tokenSymbol}',
  },
  loadingText: {
    id: 'dashboard.Vesting.ClaimTokensPage.loadingText',
    defaultMessage: 'Loading Colony',
  },
});

const displayName = 'dashboard.Vesting.UnwrapTokensPage';

type Props = RouteChildrenProps<{ colonyName: string }>;

const UNKNOWN_TOKEN_SYMBOL = '???';

const UnwrapTokensPage = ({ match }: Props) => {
  if (!match) {
    throw new Error(
      `No match found for route in ${displayName} Please check route setup.`,
    );
  }

  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { walletAddress } = useLoggedInUser();

  const { data, error, loading } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });

  if (error) console.error(error);

  const { data: metaColonyData } = useMetaColonyQuery();

  const {
    data: wrappedTokenData,
    loading: loadingWrappedTokenData,
  } = useUnwrapTokenForMetacolonyQuery({
    variables: {
      userAddress: walletAddress,
    },
  });

  const { wrappedToken, unwrappedToken } =
    wrappedTokenData?.unwrapTokenForMetacolony || {};

  const transform = useCallback(
    mapPayload(() => ({
      amount: wrappedToken?.balance || 0,
      userAddress: walletAddress,
      unwrappedTokenAddress: unwrappedToken?.address,
      colonyAddress: data?.processedColony?.colonyAddress,
    })),
    [data],
  );

  if (
    loading ||
    (data?.processedColony && data.processedColony.colonyName !== colonyName) ||
    (data?.colonyAddress &&
      !data?.processedColony &&
      !((data.colonyAddress as any) instanceof Error))
  ) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (
    !colonyName ||
    error ||
    !data?.processedColony ||
    (data?.colonyAddress as any) instanceof Error
  ) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (
    !process.env.META_WRAPPED_TOKEN_ADDRESS ||
    metaColonyData?.processedMetaColony?.colonyAddress !==
      data?.processedColony?.colonyAddress
  ) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.META_UNWRAP_TOKEN}
      success={ActionTypes.META_UNWRAP_TOKEN_SUCCESS}
      error={ActionTypes.META_UNWRAP_TOKEN_ERROR}
      transform={transform}
    >
      {(formValues: FormikProps<{}>) => (
        <VestingPageLayout
          {...formValues}
          isLoading={loadingWrappedTokenData}
          title={
            <Heading
              appearance={{ size: 'medium', theme: 'dark' }}
              text={MSG.title}
              textValues={{
                tokenSymbol: wrappedToken?.symbol || UNKNOWN_TOKEN_SYMBOL,
              }}
            />
          }
          tableValues={[
            {
              label: (
                <FormattedMessage
                  {...MSG.wrappedBalance}
                  values={{
                    tokenSymbol: wrappedToken?.symbol || UNKNOWN_TOKEN_SYMBOL,
                  }}
                />
              ),
              value: wrappedToken?.balance || '0',
            },
            {
              label: (
                <FormattedMessage
                  {...MSG.balance}
                  values={{
                    tokenSymbol: unwrappedToken?.symbol || UNKNOWN_TOKEN_SYMBOL,
                  }}
                />
              ),
              value: unwrappedToken?.balance || '0',
            },
          ]}
          buttonText={MSG.buttonUnwrap}
          buttonTextValues={{
            tokenSymbol: wrappedToken?.symbol || UNKNOWN_TOKEN_SYMBOL,
          }}
          tokenDecimals={getTokenDecimalsWithFallback(wrappedToken?.decimals)}
          buttonDisabled={bigNumberify(wrappedToken?.balance || 0).isZero()}
        />
      )}
    </ActionForm>
  );
};

UnwrapTokensPage.displayName = displayName;

export default UnwrapTokensPage;
