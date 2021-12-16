import React from 'react';
import { FormikProps } from 'formik';
import { defineMessage, FormattedMessage } from 'react-intl';
import { Redirect, RouteChildrenProps, useParams } from 'react-router-dom';

import { ActionForm } from '~core/Fields';
import Heading from '~core/Heading';

import LoadingTemplate from '~pages/LoadingTemplate';

import { useColonyFromNameQuery, useMetaColonyQuery } from '~data/index';
import { ActionTypes } from '~redux/actionTypes';
import { NOT_FOUND_ROUTE } from '~routes/index';

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
  loadingText: {
    id: 'dashboard.Vesting.ClaimTokensPage.loadingText',
    defaultMessage: 'Loading Colony',
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

  const { data, error, loading } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
    pollInterval: 5000,
  });

  if (error) console.error(error);

  const { data: metaColonyData } = useMetaColonyQuery();

  // replace with a query later
  const token = {
    symbol: 'CLNY',
    totalAllocation: '1000000000000000000000000',
    claimable: '50000000000000000000000',
    claimed: '300000000000000000000',
    decimals: 18,
  };

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
    !process.env.META_VESTING_CONTRACT_ADDRESS ||
    metaColonyData?.processedMetaColony?.colonyAddress !==
      data?.processedColony?.colonyAddress
  ) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  return (
    <ActionForm
      initialValues={{}}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
      submit={ActionTypes.COLONY_ACTION_GENERIC}
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
    >
      {(formValues: FormikProps<{}>) => (
        <VestingPageLayout
          {...formValues}
          // Add proper loading state when connected to queries
          isLoading={false}
          title={
            <Heading
              appearance={{ size: 'medium', theme: 'dark' }}
              text={MSG.title}
              textValues={{ tokenSymbol: token?.symbol }}
            />
          }
          tableValues={[
            {
              label: <FormattedMessage {...MSG.totalAllocation} />,
              value: token.totalAllocation,
            },
            {
              label: <FormattedMessage {...MSG.claimable} />,
              value: token.claimable,
            },
            {
              label: <FormattedMessage {...MSG.claimed} />,
              value: token.claimed,
            },
          ]}
          buttonText={MSG.buttonClaim}
          tokenDecimals={token.decimals}
        />
      )}
    </ActionForm>
  );
};

ClaimTokensPage.displayName = displayName;

export default ClaimTokensPage;
