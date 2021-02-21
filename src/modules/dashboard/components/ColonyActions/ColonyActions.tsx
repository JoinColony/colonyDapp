import React, { useCallback, useState, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Extension } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import ActionsList, {
  ClickHandlerProps as RedirectHandlerProps,
} from '~core/ActionsList';
import { Select, Form } from '~core/Fields';
import LoadMoreButton from '~core/LoadMoreButton';
import { SpinnerLoader } from '~core/Preloaders';

import {
  Colony,
  useTransactionMessagesCountQuery,
  useSubscriptionSubgraphOneTxSubscription,
  useSubscriptionSubgraphEventsThatAreActionsSubscription,
  useColonyExtensionsQuery,
} from '~data/index';
import {
  ActionsSortOptions,
  ActionsSortSelectOptions,
} from '../shared/actionsSort';
import { getActionsListData } from '../../transformers';
import { useTransformer } from '~utils/hooks';
import {
  ColonyActions as ColonyActionTypes,
  FormattedAction,
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
  colony: { colonyAddress, colonyName },
  colony,
  ethDomainId,
}: Props) => {
  const [actionsSortOption, setActionsSortOption] = useState<string>(
    ActionsSortOptions.NEWEST,
  );

  const [dataPage, setDataPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;

  const history = useHistory();

  const {
    data: oneTxActions,
    loading: oneTxActionsLoading,
  } = useSubscriptionSubgraphOneTxSubscription({
    variables: {
      skip: 0,
      first: 100,
      colonyAddress: colonyAddress?.toLowerCase(),
    },
  });

  const {
    data: eventsActions,
    loading: eventsActionsLoading,
  } = useSubscriptionSubgraphEventsThatAreActionsSubscription({
    variables: {
      skip: 0,
      first: 100,
      colonyAddress: colonyAddress?.toLowerCase(),
    },
  });

  const {
    data: commentCount,
    loading: commentCountLoading,
  } = useTransactionMessagesCountQuery({
    variables: { colonyAddress },
  });

  const {
    data: extensionsData,
    loading: extensionDataLoading,
  } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });

  /*
   * @NOTE Prettier is stupid
   *
   * I want to fix this line so it's under 80 but apparently it doesn't like
   * my solution and over-writes with a wrong approach
   */
  // eslint-disable-next-line max-len
  const oneTxPaymentExtension = extensionsData?.processedColony?.installedExtensions?.find(
    ({ extensionId }) => extensionId === Extension.OneTxPayment,
  );

  const actions = useTransformer(getActionsListData, [
    { ...oneTxActions, ...eventsActions },
    commentCount?.transactionMessagesCount,
    /*
     * @TODO Filter out all extensions roles actions, not just the oneTx one
     */
    oneTxPaymentExtension?.address || AddressZero,
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
        case ActionsSortOptions.NEWEST:
          return second.createdAt.getTime() - first.createdAt.getTime();
        case ActionsSortOptions.OLDEST:
          return first.createdAt.getTime() - second.createdAt.getTime();
        case ActionsSortOptions.HAVE_ACTIVITY:
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
    extensionDataLoading ||
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
            initialValues={{ filter: ActionsSortOptions.NEWEST }}
            onSubmit={() => undefined}
          >
            <div className={styles.filter}>
              <Select
                appearance={{ alignOptions: 'left', theme: 'alt' }}
                elementOnly
                label={MSG.labelFilter}
                name="filter"
                options={ActionsSortSelectOptions}
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
