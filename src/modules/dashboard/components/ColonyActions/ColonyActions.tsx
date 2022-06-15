import React, { useCallback, useState, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
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
  useActionsThatNeedAttentionQuery,
  useLoggedInUser,
  ActionThatNeedsAttention,
  useSubgraphMotionsSubscription,
  useColonyExtensionsQuery,
  useCommentCountSubscription,
} from '~data/index';
import { SortOptions, SortSelectOptions } from '../shared/sortOptions';
import { getActionsListData } from '~modules/dashboard/transformers';
import { useTransformer } from '~utils/hooks';
import { createAddress } from '~utils/web3';
import {
  ColonyActions as ColonyActionTypes,
  FormattedAction,
  Address,
} from '~types/index';

import styles from './ColonyActions.css';
import { mobile } from '~utils/mediaQueries';

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
  const isMobile = useMediaQuery({ query: mobile });
  const ITEMS_PER_PAGE = isMobile ? 3 : 10;

  const [actionsSortOption, setActionsSortOption] = useState<string>(
    SortOptions.NEWEST,
  );
  const [dataPage, setDataPage] = useState<number>(1);

  const { walletAddress } = useLoggedInUser();
  const history = useHistory();
  const { data: extensions } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });
  const { installedExtensions } = extensions?.processedColony || {};

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
      sortDirection: 'desc',
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
      sortDirection: 'desc',
    },
  });

  const {
    data: commentCount,
    loading: commentCountLoading,
  } = useCommentCountSubscription({
    variables: { colonyAddress },
  });

  const {
    data: actionStatuses,
    loading: actionStatusesLoading,
  } = useActionsThatNeedAttentionQuery({
    variables: {
      colonyAddress,
      walletAddress,
    },
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
      extensionAddress: votingReputationExtension?.address?.toLowerCase() || '',
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
      /*
       * Prettier is being stupid again
       *
       * Just try it! Remove the disable below and see for yourself what stupid
       * suggestions it gives up
       */
      // eslint-disable-next-line max-len
      actionsThatNeedAttention: actionStatuses?.actionsThatNeedAttention as ActionThatNeedsAttention[],
    },
  ]);

  /* Needs to be tested when all action types are wirde up & reflected in the list */
  const filteredActions = useMemo(() => {
    const filterActions = !ethDomainId
      ? actions
      : actions.filter(
          (action) =>
            Number(action.fromDomain) === ethDomainId ||
            /* when no specific domain in the action it is displayed in Root */
            (ethDomainId === 1 && action.fromDomain === undefined) ||
            /* when transfering funds the list shows both sender & recipient */
            (action.actionType === ColonyActionTypes.MoveFunds &&
              Number(action.toDomain) === ethDomainId),
        );

    /* filter out duplicate action items on passed motions */
    if (motions && motions.motions?.length > 0) {
      const motionExtensionAddresses =
        motions.motions
          .filter((motion) => motion.extensionAddress)
          .map((motion) => createAddress(motion.extensionAddress)) || [];
      if (motionExtensionAddresses.length > 0) {
        return filterActions.filter((action) => {
          return !motionExtensionAddresses.includes(
            createAddress(action.initiator),
          );
        });
      }
    }

    return filterActions;
  }, [ethDomainId, actions, motions]);

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
    actionStatusesLoading ||
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
                  appearance={{ alignOptions: 'left', theme: 'alt' }}
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
