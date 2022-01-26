import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import { defineMessage, FormattedMessage } from 'react-intl';
import { Redirect, RouteChildrenProps, useParams } from 'react-router-dom';
import { bigNumberify } from 'ethers/utils';

import { ActionForm } from '~core/Fields';
import Heading from '~core/Heading';
import InfoPopover from '~core/InfoPopover';

import LoadingTemplate from '~pages/LoadingTemplate';

import {
  useColonyFromNameQuery,
  useMetaColonyQuery,
  useClaimTokensFromMetacolonyQuery,
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
    id: 'dashboard.Vesting.ClaimTokensPage.title',
    defaultMessage: 'Claim {tokenSymbol}',
  },
  totalAllocation: {
    id: 'dashboard.Vesting.ClaimTokensPage.totalAllocation',
    defaultMessage: 'Total Allocation',
  },
  claimable: {
    id: 'dashboard.Vesting.ClaimTokensPage.claimable',
    defaultMessage: 'Claimable now',
  },
  claimed: {
    id: 'dashboard.Vesting.ClaimTokensPage.claimable',
    defaultMessage: 'Claimed',
  },
  buttonClaim: {
    id: 'dashboard.Vesting.ClaimTokensPage.buttonClaim',
    defaultMessage: 'Claim',
  },
  loadingColonyText: {
    id: 'dashboard.Vesting.ClaimTokensPage.loadingColonyText',
    defaultMessage: 'Loading Colony',
  },
  loadingGrantsText: {
    id: 'dashboard.Vesting.ClaimTokensPage.loadingGrantsText',
    defaultMessage: 'Loading Grants',
  },
});

const displayName = 'dashboard.Vesting.ClaimTokensPage';

type Props = RouteChildrenProps<{ colonyName: string }>;

const ClaimTokensPage = ({ match }: Props) => {
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
    data: claimTokensData,
    loading: loadingclaimTokensData,
  } = useClaimTokensFromMetacolonyQuery({
    variables: {
      userAddress: walletAddress,
    },
  });

  const { grantsToken, grants } =
    claimTokensData?.claimTokensFromMetacolony || {};

  const transform = useCallback(
    mapPayload(() => {
      return {
        userAddress: walletAddress,
        colonyAddress: data?.processedColony?.colonyAddress,
        grantsTokenAddress: grantsToken?.address,
      };
    }),
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
        <LoadingTemplate loadingText={MSG.loadingColonyText} />
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
    !process.env.META_VESTING_CONTRACT_ADDRESS ||
    metaColonyData?.processedMetaColony?.colonyAddress !==
      data?.processedColony?.colonyAddress
  ) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.META_CLAIM_ALLOCATION}
      success={ActionTypes.META_CLAIM_ALLOCATION_SUCCESS}
      error={ActionTypes.META_CLAIM_ALLOCATION_ERROR}
      transform={transform}
    >
      {(formValues: FormikProps<{}>) => (
        <VestingPageLayout
          {...formValues}
          isLoading={loadingclaimTokensData}
          looadingText={MSG.loadingGrantsText}
          title={
            <InfoPopover
              token={grantsToken}
              isTokenNative={
                grantsToken?.address ===
                data?.processedColony?.nativeTokenAddress
              }
              popperProps={{
                placement: 'bottom',
              }}
            >
              <div className={styles.popoverWrapper}>
                <Heading
                  appearance={{ size: 'medium', theme: 'dark' }}
                  text={MSG.title}
                  textValues={{ tokenSymbol: 'TOK' }}
                />
              </div>
            </InfoPopover>
          }
          tableValues={[
            {
              label: <FormattedMessage {...MSG.totalAllocation} />,
              value: grants?.totalAllocation || '0',
            },
            {
              label: <FormattedMessage {...MSG.claimable} />,
              value: grants?.claimable || '0',
            },
            {
              label: <FormattedMessage {...MSG.claimed} />,
              value: grants?.claimed || '0',
            },
          ]}
          buttonText={MSG.buttonClaim}
          tokenDecimals={getTokenDecimalsWithFallback(grantsToken?.decimals)}
          buttonDisabled={bigNumberify(grants?.claimable || 0).isZero()}
        />
      )}
    </ActionForm>
  );
};

ClaimTokensPage.displayName = displayName;

export default ClaimTokensPage;
