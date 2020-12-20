import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import ActionsList, {
  ClickHandlerProps as RedirectHandlerProps,
} from '~core/ActionsList';
import { Select, Form } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';

import {
  Colony,
  useSubgraphActionsQuery,
  useTransactionMessagesCountQuery,
} from '~data/index';
import {
  ActionFilterOptions,
  ActionFilterSelectOptions,
} from '../shared/actionsFilter';
import { immutableSort } from '~utils/arrays';
import { getActionsListData } from '../../transformers';
import { useTransformer } from '~utils/hooks';
import { FormattedAction } from '~types/index';

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
  loadMore: {
    id: 'dashboard.ColonyActions.loadMore',
    defaultMessage: 'Load More',
  },
  noActionsFound: {
    id: 'dashboard.ColonyActions.noActionsFound',
    defaultMessage: `The colony did not create any actions yet.
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
}: Props) => {
  const [actionsFilter, setActionsFilter] = useState<string>(
    ActionFilterOptions.NEWEST,
  );

  const history = useHistory();

  const {
    data: paymentActions,
    loading: paymentActionsLoading,
    stopPolling: stopPaymentActionsPolling,
  } = useSubgraphActionsQuery({
    variables: {
      /*
       * @TODO Find a way to better handle address normalization
       * Maybe this will/should be fixed on the subgraph's side ?
       */
      colonyAddress: colonyAddress?.toLowerCase(),
    },
    pollInterval: 1000,
  });

  const {
    data: commentCount,
    loading: commentCountLoading,
    stopPolling: stopCommentCountPolling,
  } = useTransactionMessagesCountQuery({
    variables: { colonyAddress },
    pollInterval: 1000,
  });

  const actions = useTransformer(getActionsListData, [
    paymentActions,
    commentCount?.transactionMessagesCount,
  ]);

  /*
   * @NOTE This is why we can't have nice things
   *
   * This is needed since "The Graph" doesn't support GraphQL subsriptions.
   * Tis means that we can't fetch new data properly.
   *
   * (without invalidating the cache, making the full network fetch again,
   * then displaying the new data, all the while triggering all the re-renders
   * possible and all the loading states -- try it, it looks horrible)
   *
   * Instead, I've opted to set a polling interval of 1 second, and in the event
   * the user lingers too much on this page, stop the interval after 2 minutes.
   *
   * This is dangerous, especially on low power devices, but it's the only viable
   * way we have currently of making the app "more interactive".
   *
   * This could easily be solved by "The Graph" supporting subscriptions, but
   * sadly that's not on the horizon yet.
   *
   * Another avenue we can explore is making our own blockchain listener, and
   * when it sees an action being created (using topics mapping) then trigger
   * a new query fetch -- but this is a whole can of worms onto itself.
   */
  useEffect(() => {
    const idleFailsafe = 60 * 1000 * 2; // 2 mins
    setTimeout(() => {
      stopPaymentActionsPolling();
      stopCommentCountPolling();
    }, idleFailsafe);
  }, [stopPaymentActionsPolling, stopCommentCountPolling]);

  const filter = useCallback(() => {
    switch (actionsFilter) {
      case ActionFilterOptions.NEWEST:
      case ActionFilterOptions.HAVE_ACTIVITY:
        return true;

      default:
        return true;
    }
  }, [actionsFilter]);

  const sort = useCallback(
    (first: FormattedAction, second: FormattedAction) => {
      if (!(first && second)) return 0;

      const sortingOrderOption = 'desc';
      return sortingOrderOption === 'desc'
        ? second.createdAt.getTime() - first.createdAt.getTime()
        : first.createdAt.getTime() - second.createdAt.getTime();
    },
    [],
  );

  const filteredActionsData: FormattedAction[] = useMemo(
    () =>
      filter
        ? immutableSort(actions, sort).filter((action) =>
            action ? filter() : true,
          )
        : actions,
    [filter, sort, actions],
  );

  const handleActionRedirect = useCallback(
    ({ transactionHash }: RedirectHandlerProps) =>
      history.push(`/colony/${colonyName}/tx/${transactionHash}`),
    [colonyName, history],
  );

  if (
    paymentActionsLoading ||
    commentCountLoading ||
    !paymentActions ||
    !commentCount
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
      {actions?.length ? (
        <>
          <Form
            initialValues={{ filter: ActionFilterOptions.NEWEST }}
            onSubmit={() => undefined}
          >
            <div className={styles.filter}>
              <Select
                appearance={{ alignOptions: 'left', theme: 'alt' }}
                elementOnly
                label={MSG.labelFilter}
                name="filter"
                options={ActionFilterSelectOptions}
                onChange={setActionsFilter}
                placeholder={MSG.placeholderFilter}
              />
            </div>
          </Form>
          <ActionsList
            items={filteredActionsData}
            handleItemClick={handleActionRedirect}
            colony={colony}
          />
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
