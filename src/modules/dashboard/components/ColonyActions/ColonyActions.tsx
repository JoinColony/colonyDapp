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
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

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
import { getActionsListData } from '../../transformers';
import { useTransformer } from '~utils/hooks';
import {
  ColonyActions as ColonyActionTypes,
  FormattedAction,
  Address,
} from '~types/index';

import styles from './ColonyActions.css';

const MSG = defineMessages({
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
   * Via the domains dropdown from #2288
   */
  ethDomainId?: number;
};

const displayName = 'dashboard.ColonyActions';

const ColonyActions = ({
  colony: { colonyAddress, colonyName, extensionAddresses },
  colony,
  ethDomainId,
}: Props) => {
  const { walletAddress } = useLoggedInUser();

  const [actionsSortOption, setActionsSortOption] = useState<string>(
    SortOptions.NEWEST,
  );

  const [dataPage, setDataPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;

  const history = useHistory();

  const { installedExtensionsAddresses } = useEnabledExtensions({
    colonyAddress,
  });

  const {
    data: oneTxActions,
    loading: oneTxActionsLoading,
  } = useSubgraphOneTxSubscription({
    variables: {
      skip: 0,
      /*
       * @NOTE We always need to fetch one more item so that we know that more
       * items exist and we show the "load more" button
       */
      first: ITEMS_PER_PAGE * dataPage + 1,
      colonyAddress: colonyAddress?.toLowerCase(),
    },
  });

  const {
    data: eventsActions,
    loading: eventsActionsLoading,
  } = useSubgraphEventsThatAreActionsSubscription({
    variables: {
      skip: 0,
      /*
       * @NOTE We always need to fetch one more item so that we know that more
       * items exist and we show the "load more" button
       */
      first: ITEMS_PER_PAGE * dataPage + 1,
      colonyAddress: colonyAddress?.toLowerCase(),
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

  const { data: extensions } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  /*
   * @NOTE Prettier is being stupid
   */
  // eslint-disable-next-line max-len
  const votingReputationExtension = extensions?.processedColony?.installedExtensions.find(
    ({ extensionId }) => extensionId === Extension.VotingReputation,
  );

  const { data: motions } = useSubgraphMotionsSubscription({
    variables: {
      skip: 0,
      /*
       * @NOTE We always need to fetch one more item so that we know that more
       * items exist and we show the "load more" button
       */
      first: ITEMS_PER_PAGE * dataPage + 1,
      colonyAddress: colonyAddress?.toLowerCase(),
      extensionAddress: votingReputationExtension?.address?.toLowerCase() || '',
    },
  });

  const actions = useTransformer(getActionsListData, [
    installedExtensionsAddresses,
    { ...oneTxActions, ...eventsActions, ...motions },
    /*
     * @NOTE That due to the way autentication works for us, and that we use
     * subscriptions, the comment count value is not unreliable since we cannot
     * filter it out properly
     * There's two alternatives to this, none of which are pleasant:
     * - switch back to using queries (and immplement filtering on the server)
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
  const filteredActions = useMemo(
    () =>
      !ethDomainId
        ? actions
        : actions.filter(
            (action) =>
              Number(action.fromDomain) === ethDomainId ||
              /* when no specific domain in the action it is displayed in Root */
              (ethDomainId === 1 && action.fromDomain === undefined) ||
              /* when transfering funds the list shows both sender & recipient */
              (action.actionType === ColonyActionTypes.MoveFunds &&
                Number(action.toDomain) === ethDomainId),
          ),
    [ethDomainId, actions],
  );

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
