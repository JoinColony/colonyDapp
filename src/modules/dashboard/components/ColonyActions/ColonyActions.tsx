import React, { useCallback, useState, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Extension } from '@colony/colony-js';

import ActionsList, {
  ClickHandlerProps as RedirectHandlerProps,
} from '~core/ActionsList';
import { Select, Form } from '~core/Fields';
import LoadMoreButton from '~core/LoadMoreButton';
import { SpinnerLoader } from '~core/Preloaders';
import Link from '~core/Link';

import {
  Colony,
  useSubgraphOneTxSubscription,
  useSubgraphEventsThatAreActionsSubscription,
  useSubgraphMotionsSubscription,
  useColonyExtensionsQuery,
  useCommentCountSubscription,
} from '~data/index';
import { SortOptions, SortSelectOptions } from '../shared/sortOptions';
import { getActionsListData } from '~modules/dashboard/transformers';
import { useTransformer } from '~utils/hooks';
import { createAddress } from '~utils/web3';
import { FormattedAction, Address } from '~types/index';

import {
  ACTION_DECISION_MOTION_CODE,
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
} from '~constants';

import styles from './ColonyActions.css';

const MSG = defineMessages({
  actionsTitle: {
    id: 'dashboard.ColonyActions.actionsTitle',
    defaultMessage: 'Actions',
  },
  transactionsLogLink: {
    id: 'dashboard.ColonyActions.transactionsLogLink',
    defaultMessage: 'Transactions log',
  },
  labelFilter: {
    id: 'dashboard.ColonyActions.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.ColonyActions.placeholderFilter',
    defaultMessage: 'Filter',
  },
  noActionsFound: {
    id: 'dashboard.ColonyActions.noActionsFound',
    defaultMessage: `There are no actions yet.
      {isDevMode, select,
        true {
          {break}
          This likely happended because you didn't start the Subgraph service
        }
        other {}
      }`,
  },
  loading: {
    id: 'dashboard.ColonyActions.loading',
    defaultMessage: `Loading Actions`,
  },
});

type Props = {
  colony: Colony;
  /*
   * @NOTE Needed for filtering based on domain
   */
  ethDomainId?: number;
};

const displayName = 'dashboard.ColonyActions';

const ColonyActions = ({
  colony: { colonyAddress, colonyName, extensionAddresses },
  colony,
  ethDomainId,
}: Props) => {
  const ITEMS_PER_PAGE = 10;
  const NUM_FETCH_ITEMS = 50;

  const [actionsSortOption, setActionsSortOption] = useState<string>(
    SortOptions.NEWEST,
  );
  const [dataPage, setDataPage] = useState<number>(1);

  const history = useHistory();
  const { data: extensions } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });
  const { installedExtensions } = extensions?.processedColony || {};

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

  const getSubgraphDomainIdFilter = () => {
    if (ethDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
      return '';
    }
    return `${colonyAddress?.toLowerCase()}_domain_${ethDomainId}`;
  };

  const {
    data: oneTxActions,
    loading: oneTxActionsLoading,
  } = useSubgraphOneTxSubscription({
    variables: {
      /*
       * @NOTE We always need to fetch one more item so that we know that more
       * items exist and we show the "load more" button
       */
      colonyAddress: colonyAddress?.toLowerCase(),
      subgraphDomainId: getSubgraphDomainIdFilter(),
      sortDirection: 'desc',
      first: getNumbersOfEntriesToFetch(),
    },
  });

  const {
    data: eventsActions,
    loading: eventsActionsLoading,
  } = useSubgraphEventsThatAreActionsSubscription({
    variables: {
      /*
       * @NOTE We always need to fetch one more item so that we know that more
       * items exist and we show the "load more" button
       */
      colonyAddress: colonyAddress?.toLowerCase(),
      subgraphDomainId: getSubgraphDomainIdFilter(),
      sortDirection: 'desc',
      first: getNumbersOfEntriesToFetch(),
    },
  });

  const {
    data: commentCount,
    loading: commentCountLoading,
  } = useCommentCountSubscription({
    variables: { colonyAddress },
  });

  const votingReputationExtension = installedExtensions?.find(
    ({ extensionId }) => extensionId === Extension.VotingReputation,
  );

  const { data: motions } = useSubgraphMotionsSubscription({
    variables: {
      /*
       * @NOTE We always need to fetch one more item so that we know that more
       * items exist and we show the "load more" button
       */
      colonyAddress: colonyAddress?.toLowerCase(),
      subgraphDomainId: getSubgraphDomainIdFilter(),
      extensionAddress: votingReputationExtension?.address?.toLowerCase() || '',
      motionActionNot: ACTION_DECISION_MOTION_CODE,
      sortDirection: 'desc',
      first: getNumbersOfEntriesToFetch(),
    },
  });

  const actions = useTransformer(getActionsListData, [
    installedExtensions?.map(({ address }) => address) as string[],
    { ...oneTxActions, ...eventsActions, ...motions },
    /*
     * @NOTE That due to the way autentication works for us, and that we use
     * subscriptions, the comment count value is unreliable since we cannot
     * filter it out properly
     * There's two alternatives to this, none of which are pleasant:
     * - switch back to using queries (and implement filtering on the server)
     * - fetch the whole comments, for all actions, filter then and count then locally
     */
    commentCount?.transactionMessagesCount,
    {
      extensionAddresses: extensionAddresses as Address[],
    },
  ]);

  /* Needs to be tested when all action types are wired up & reflected in the list */
  const filteredActions = useMemo(() => {
    /* filter out duplicate action items on passed motions */
    if (motions && motions.motions?.length > 0) {
      const motionExtensionAddresses =
        motions.motions
          .filter((motion) => motion.extensionAddress)
          .map((motion) => createAddress(motion.extensionAddress)) || [];
      if (motionExtensionAddresses.length > 0) {
        return actions.filter((action) => {
          return !motionExtensionAddresses.includes(
            createAddress(action.initiator),
          );
        });
      }
    }

    return actions;
  }, [actions, motions]);

  const handleDataPagination = useCallback(() => {
    setDataPage(dataPage + 1);
  }, [dataPage]);

  const actionsSort = useCallback(
    (first: FormattedAction, second: FormattedAction) => {
      switch (actionsSortOption) {
        case SortOptions.NEWEST:
          return second.createdAt.getTime() - first.createdAt.getTime();
        case SortOptions.OLDEST:
          return first.createdAt.getTime() - second.createdAt.getTime();
        case SortOptions.HAVE_ACTIVITY:
          return second.commentCount - first.commentCount;
        default:
          return 0;
      }
    },
    [actionsSortOption],
  );

  const sortedActionsData: FormattedAction[] = useMemo(
    () => filteredActions.sort(actionsSort),
    [actionsSort, filteredActions],
  );

  const paginatedActionData: FormattedAction[] = sortedActionsData.slice(
    0,
    ITEMS_PER_PAGE * dataPage,
  );

  const handleActionRedirect = useCallback(
    ({ transactionHash }: RedirectHandlerProps) =>
      history.push(`/colony/${colonyName}/tx/${transactionHash}`),
    [colonyName, history],
  );

  if (
    oneTxActionsLoading ||
    eventsActionsLoading ||
    commentCountLoading ||
    !commentCount ||
    !oneTxActions ||
    !eventsActions
  ) {
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
    <div className={styles.main}>
      {sortedActionsData?.length ? (
        <>
          <div className={styles.bar}>
            <div className={styles.title}>
              <FormattedMessage {...MSG.actionsTitle} />
            </div>

            <Form
              initialValues={{ filter: SortOptions.NEWEST }}
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
                  onChange={setActionsSortOption}
                  placeholder={MSG.placeholderFilter}
                />
              </div>
            </Form>

            <Link
              className={styles.link}
              to={`/colony/${colonyName}/events`}
              data-test="transactionsLog"
            >
              <FormattedMessage {...MSG.transactionsLogLink} />
            </Link>
          </div>
          <ActionsList
            items={paginatedActionData}
            handleItemClick={handleActionRedirect}
            colony={colony}
          />
          {ITEMS_PER_PAGE * dataPage < actions.length && (
            <LoadMoreButton
              onClick={handleDataPagination}
              isLoadingData={oneTxActionsLoading || eventsActionsLoading}
            />
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <FormattedMessage
            {...MSG.noActionsFound}
            values={{
              /*
               * @TODO Maybe make this check smarter?
               *
               * By injecting a env var when starting dev:heavy and actually
               * knowing if the subgraph process was started, rather then
               * just guessing...
               */
              isDevMode: process.env.NODE_ENV === 'development',
              break: <br />,
            }}
          />
        </div>
      )}
    </div>
  );
};

ColonyActions.displayName = displayName;

export default ColonyActions;
