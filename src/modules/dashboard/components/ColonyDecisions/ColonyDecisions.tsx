import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Extension, ROOT_DOMAIN_ID } from '@colony/colony-js';

import ActionsList, {
  ClickHandlerProps as RedirectHandlerProps,
} from '~core/ActionsList';
import { Select, Form } from '~core/Fields';
import LoadMoreButton from '~core/LoadMoreButton';
import { SpinnerLoader } from '~core/Preloaders';
import {
  Colony,
  useSubgraphDecisionsSubscription,
  useColonyExtensionsQuery,
} from '~data/index';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { useTransformer } from '~utils/hooks';
import { getActionsListData } from '~modules/dashboard/transformers';
import { ACTION_DECISION_MOTION_CODE } from '~constants';

import { SortOptions, SortSelectOptions } from './constants';
import styles from './ColonyDecisions.css';

const MSG = defineMessages({
  decisionsTitle: {
    id: 'dashboard.ColonyDecisions.decisionsTitle',
    defaultMessage: 'Decisions',
  },
  labelFilter: {
    id: 'dashboard.ColonyDecisions.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.ColonyDecisions.placeholderFilter',
    defaultMessage: 'Filter',
  },
  noDecisionsFound: {
    id: 'dashboard.ColonyDecisions.noDecisionsFound',
    defaultMessage: 'No decisions exist',
  },
  loading: {
    id: 'dashboard.ColonyDecisions.loading',
    defaultMessage: 'Loading decisions',
  },
  installExtension: {
    id: 'dashboard.ColonyDecisions.installExtension',
    defaultMessage: `You need to install the Governance extension to use the Decisions feature.`,
  },
});

type Props = {
  colony: Colony;
  /*
   * @NOTE Needed for filtering based on domain
   */
  ethDomainId?: number;
};

/* temp data */
const data = [
  {
    id: `0xeabe562c979679dc4023dd23e8c6aa782448c2e7_motion_0xa1e73506f3ef6dc19dc27b750adf585fd0f30c63_2`,
    initiator: '0xb77d57f4959eafa0339424b83fcfaf9c15407461',
    recipient: '0x0000000000000000000000000000000000000000',
    title: 'I want to add dark mode to the Dapp',
    motionState: 'Passed',
    isDecision: true,
    motionId: '2',
    createdAt: new Date(
      'Sun Aug 17 2022 12:48:59 GMT+0300 (Eastern European Summer Time)',
    ),
    ending: new Date(
      'Sun Aug 27 2022 12:48:59 GMT+0300 (Eastern European Summer Time)',
    ),
  },
  {
    title: 'Update the logo design',
    isDecision: true,
    actionType: undefined,
    amount: '0',
    blockNumber: 853,
    commentCount: 0,
    createdAt: new Date(
      'Sun Aug 14 2022 12:48:59 GMT+0300 (Eastern European Summer Time)',
    ),
    ending: new Date(
      'Sun Aug 24 2022 12:48:59 GMT+0300 (Eastern European Summer Time)',
    ),
    decimals: '18',
    fromDomain: '1',
    id: `0xeabe562c979679dc4023dd23e8c6aa782448c2e7_motion_0xa1e73506f3ef6dc19dc27b750adf585fd0f30c63_1`,
    initiator: '0xb77d57f4959eafa0339424b83fcfaf9c15407461',
    motionId: '1',
    motionState: 'Staking',
    recipient: '0x0000000000000000000000000000000000000000',
    reputationChange: '0',
    requiredStake: '1010101010101010101',
    status: undefined,
    symbol: '???',
    timeoutPeriods: undefined,
    toDomain: '1',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    totalNayStake: '0',
    transactionHash:
      '0x9c742b1392fadb48c0bc0d2cebdd518e7b11c0c1ab426c084a06c68ea77f8f70',
    transactionTokenAddress: undefined,
  },
  {
    title: 'Update the actions design',
    isDecision: true,
    actionType: undefined,
    amount: '0',
    blockNumber: 853,
    commentCount: 0,
    createdAt: new Date(
      'Sun Aug 18 2022 12:48:59 GMT+0300 (Eastern European Summer Time)',
    ),
    ending: new Date(
      'Sun Aug 28 2022 12:48:59 GMT+0300 (Eastern European Summer Time)',
    ),
    decimals: '18',
    fromDomain: '2',
    id: `0xeabe562c979679dc4023dd23e8c6aa782448c2e7_motion_0xa1e73506f3ef6dc19dc27b750adf585fd0f30c63_3`,
    initiator: '0xb77d57f4959eafa0339424b83fcfaf9c15407461',
    motionId: '1',
    motionState: 'Staked',
    recipient: '0x0000000000000000000000000000000000000000',
    reputationChange: '0',
    requiredStake: '1010101010101010101',
    status: undefined,
    symbol: '???',
    timeoutPeriods: undefined,
    toDomain: '2',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    totalNayStake: '0',
    transactionHash:
      '0x9c742b1392fadb48c0bc0d2cebdd518e7b11c0c1ab426c084a06c68ea77f8f70',
    transactionTokenAddress: undefined,
  },
];

const ITEMS_PER_PAGE = 10;

const ColonyDecisions = ({
  colony,
  colony: { colonyName, colonyAddress },
  ethDomainId,
}: Props) => {
  const [sortOption, setSortOption] = useState<string>(
    SortOptions.ENDING_SOONEST,
  );
  const [dataPage, setDataPage] = useState<number>(1);

  // temp values, to be removed when queries are wired in
  const isLoading = false;

  const history = useHistory();

  const handleActionRedirect = useCallback(
    ({ transactionHash }: RedirectHandlerProps) =>
      history.push(`/colony/${colonyName}/tx/${transactionHash}`),
    [colonyName, history],
  );

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress,
  });

  const { data: extensions } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });
  const { installedExtensions } = extensions?.processedColony || {};
  const votingReputationExtension = installedExtensions?.find(
    ({ extensionId }) => extensionId === Extension.VotingReputation,
  );

  const { data: motions } = useSubgraphDecisionsSubscription({
    variables: {
      /*
       * @NOTE We always need to fetch one more item so that we know that more
       * items exist and we show the "load more" button
       */
      colonyAddress: colonyAddress?.toLowerCase() || '',
      extensionAddress: votingReputationExtension?.address?.toLowerCase() || '',
      motionAction: ACTION_DECISION_MOTION_CODE,
    },
  });

  const decisions = useTransformer(getActionsListData, [
    installedExtensions?.map(({ address }) => address) as string[],
    { ...motions },
  ]);

  const filteredDecisions = useMemo(
    () =>
      !ethDomainId || ethDomainId === ROOT_DOMAIN_ID
        ? decisions
        : decisions?.filter(
            (decision) =>
              decision.toDomain === ethDomainId.toString() ||
              decision.fromDomain === ethDomainId.toString() ||
              /* when no specific domain in the action it is displayed in Root */
              (ethDomainId === ROOT_DOMAIN_ID &&
                decision.fromDomain === undefined),
          ),
    [ethDomainId, decisions],
  );

  const sortedDecisions = useMemo(
    () =>
      filteredDecisions.sort((first, second) =>
        sortOption === SortOptions.ENDING_SOONEST
          ? first.createdAt.getTime() - second.createdAt.getTime()
          : second.createdAt.getTime() - first.createdAt.getTime(),
      ),
    [sortOption, filteredDecisions],
  );

  const paginatedDecisions = sortedDecisions.slice(
    0,
    ITEMS_PER_PAGE * dataPage,
  );

  if (!isVotingExtensionEnabled) {
    return (
      <div className={styles.installExtension}>
        <FormattedMessage {...MSG.installExtension} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  return (
    <div>
      {sortedDecisions.length > 0 ? (
        <>
          <div className={styles.bar}>
            <div className={styles.title}>
              <FormattedMessage {...MSG.decisionsTitle} />
            </div>
            <Form
              initialValues={{ filter: SortOptions.ENDING_SOONEST }}
              onSubmit={() => undefined}
            >
              <div className={styles.filter}>
                <Select
                  appearance={{ alignOptions: 'left', theme: 'alt' }}
                  elementOnly
                  label={MSG.labelFilter}
                  name="filter"
                  options={SortSelectOptions}
                  placeholder={MSG.placeholderFilter}
                  onChange={setSortOption}
                />
              </div>
            </Form>
          </div>
          <ActionsList
            items={paginatedDecisions}
            handleItemClick={handleActionRedirect}
            colony={colony}
          />
          {ITEMS_PER_PAGE * dataPage < data?.length && (
            <LoadMoreButton
              onClick={() => setDataPage(dataPage + 1)}
              isLoadingData={isLoading}
            />
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <FormattedMessage {...MSG.noDecisionsFound} />
        </div>
      )}
    </div>
  );
};

export default ColonyDecisions;
