import React, { useCallback, useState, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import ActionsList, {
  ClickHandlerProps as RedirectHandlerProps,
} from '~core/ActionsList';
import { Select, Form } from '~core/Fields';

import {
  Colony,
  useSubgraphPaymentActionsQuery,
  useTransactionMessagesCountQuery,
} from '~data/index';
import {
  ActionFilterOptions,
  ActionFilterSelectOptions,
} from '../shared/actionsFilter';
import { immutableSort } from '~utils/arrays';
import { getActionsListData } from '../../transformers';
import { useTransformer } from '~utils/hooks';

import styles from './ColonyActions.css';

/*
 * @TODO Replace with actual data (fetch from events most likely?)
 *
 * Item shoud be something aling these lines:
 *
 * id: string,
 * userAddress: string,
 * user?: AnyUser
 * title?: string | messageDescriptor,
 * topic?: string
 * createdAt: Date,
 * domain?: DomainType,
 * commentCount?: number,
 * status?: number
 */
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
});

type Props = {
  /*
   * @NOTE Needed for fetching the actual actions data
   */
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
    ActionFilterOptions.ENDING_SOONEST,
  );

  const history = useHistory();

  /*
   * @TODO Add loading state
   */
  const { data: paymentActions } = useSubgraphPaymentActionsQuery({
    variables: {
      /*
       * @TODO Find a way to better handle address normalization
       */
      colonyAddress: colonyAddress?.toLowerCase(),
    },
  });

  const { data: commentCount } = useTransactionMessagesCountQuery({
    variables: {
      /*
       * @TODO Find a way to btter handle address normalization
       */
      colonyAddress,
    },
  });

  const actions = useTransformer(getActionsListData, [
    paymentActions,
    commentCount?.transactionMessagesCount,
  ]);

  const filter = useCallback(() => {
    switch (actionsFilter) {
      case ActionFilterOptions.ENDING_SOONEST:
      case ActionFilterOptions.NEWEST:
      case ActionFilterOptions.HAVE_ACTIVITY:
        return true;

      default:
        return true;
    }
  }, [actionsFilter]);

  const sort = useCallback((first: any, second: any) => {
    if (!(first && second)) return 0;

    const sortingOrderOption = 'desc';
    return sortingOrderOption === 'desc'
      ? second.createdAt - first.createdAt
      : first.createdAt - second.createdAt;
  }, []);

  const filteredActionsData: any[] = useMemo(
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

  return (
    <div className={styles.main}>
      {actions?.length ? (
        <>
          <Form
            initialValues={{ filter: ActionFilterOptions.ENDING_SOONEST }}
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
