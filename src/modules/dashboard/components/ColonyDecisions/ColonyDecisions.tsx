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
import { DecisionDetails } from '~types/index';

import DraftDecisionItem from './DraftDecisionItem';
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
    defaultMessage: 'Loading Decisions',
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
  draftDecision?: DecisionDetails;
  removeDraftDecision: () => void;
};

const ITEMS_PER_PAGE = 10;
const NUM_FETCH_ITEMS = 50;

const ColonyDecisions = ({
  colony,
  colony: { colonyName, colonyAddress },
  ethDomainId,
  ...props
}: Props) => {
  const [sortOption, setSortOption] = useState<string>(
    SortOptions.ENDING_SOONEST,
  );
  const [dataPage, setDataPage] = useState<number>(1);

  const history = useHistory();

  const handleActionRedirect = useCallback(
    ({ transactionHash }: RedirectHandlerProps) =>
      history.push(`/colony/${colonyName}/decisions/tx/${transactionHash}`),
    [colonyName, history],
  );

  const {
    isVotingExtensionEnabled,
    isLoadingExtensions,
  } = useEnabledExtensions({
    colonyAddress,
  });

  const { data: extensions } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });
  const { installedExtensions } = extensions?.processedColony || {};
  const votingReputationExtension = installedExtensions?.find(
    ({ extensionId }) => extensionId === Extension.VotingReputation,
  );

  /*
   * Slapfix intended to limit the number of items fetched at once from
   * The subpgraph. You can tinker with the NUM_FETCH_ITEMS and BATCH_THRESHOLD
   * values to get more milage out of this
   *
   * Also note, that this is a poor place to store this method, but it was
   * added under a time crunch.
   */
  const getNumbersOfEntriesToFetch = () => {
    const BATCH_THRESHOLD = 10;
    let noOfFetches = 1;
    if (dataPage * ITEMS_PER_PAGE >= NUM_FETCH_ITEMS - BATCH_THRESHOLD) {
      noOfFetches += 1;
    }
    return noOfFetches * NUM_FETCH_ITEMS;
  };

  const {
    data: motions,
    loading: decisionsLoading,
  } = useSubgraphDecisionsSubscription({
    variables: {
      /*
       * @NOTE We always need to fetch one more item so that we know that more
       * items exist and we show the "load more" button
       */
      colonyAddress: colonyAddress?.toLowerCase() || '',
      extensionAddress: votingReputationExtension?.address?.toLowerCase() || '',
      sortDirection: 'desc',
      first: getNumbersOfEntriesToFetch(),
    },
  });

  const decisions = useTransformer(getActionsListData, [
    installedExtensions?.map(({ address }) => address) as string[],
    { ...motions },
    undefined,
    {},
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

  if (decisionsLoading) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  if (!isVotingExtensionEnabled && !isLoadingExtensions) {
    return (
      <div className={styles.installExtension}>
        <FormattedMessage {...MSG.installExtension} />
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
                  appearance={{
                    alignOptions: 'left',
                    theme: 'alt',
                    unrestrictedOptionsWidth: 'true',
                  }}
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
          <DraftDecisionItem colony={colony} {...props} />
          <ActionsList
            items={paginatedDecisions}
            handleItemClick={handleActionRedirect}
            colony={colony}
          />
          {ITEMS_PER_PAGE * dataPage < decisions?.length && (
            <LoadMoreButton
              onClick={() => setDataPage(dataPage + 1)}
              isLoadingData={decisionsLoading}
            />
          )}
        </>
      ) : (
        !decisionsLoading &&
        isVotingExtensionEnabled && (
          <div className={styles.draftDecisionContainer}>
            <DraftDecisionItem colony={colony} {...props} />
            <div className={styles.emptyState}>
              <FormattedMessage {...MSG.noDecisionsFound} />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ColonyDecisions;
