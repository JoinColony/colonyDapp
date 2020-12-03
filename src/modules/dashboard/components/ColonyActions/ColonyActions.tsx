import React, { useCallback, useState, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import ActionsList, {
  ClickHandlerProps as RedirectHandlerProps,
} from '~core/ActionsList';
import { Select, Form } from '~core/Fields';
import Button from '~core/Button';

import { Colony } from '~data/index';
import {
  ActionFilterOptions,
  ActionFilterSelectOptions,
} from '../shared/actionsFilter';
import { immutableSort } from '~utils/arrays';

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
import { MOCK_ACTIONS } from './mockData';

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

const ITEMS_PER_PAGE = 10;

const displayName = 'dashboard.ColonyActions';

const ColonyActions = () => {
  const [actionsFilter, setActionsFilter] = useState<string>(
    ActionFilterOptions.ENDING_SOONEST,
  );
  /*
   * @NOTE See below about the mock visual infini-loader and the reasoning behind it
   */
  const [fakeFetchingData, setFakeFetchingData] = useState<boolean>(false);
  const [mockDataPager, setMockDataPager] = useState<number>(1);

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
        ? immutableSort(MOCK_ACTIONS, sort).filter((mockAction) =>
            mockAction ? filter() : true,
          )
        : MOCK_ACTIONS,
    [filter, sort],
  );

  /*
   * @TODO This callback should handle what happends when clicking on an
   * item in the actions list.
   *
   * It should, in theory, redirect to a route that will render the full page
   * action
   *
   * This will only happen when UAC lands
   */
  const handleActionRedirect = useCallback(
    ({ id }: RedirectHandlerProps) =>
      // eslint-disable-next-line no-console
      console.log(
        'This will redirect to the specific action item route whn UAC lands',
        id,
      ),
    [],
  );

  /*
   * @TODO This fake infini-loader is for display purpouses only at this point in time
   *
   * I have no idea how or where we'll get the actual data from, so in order to make
   * a "true" infini-loader, we'll need to somehow split the data we fetch
   * (maybe by block time).
   * If the above is not an option, we'll just remove it outright (that's why
   * I didn't bake it in ActionsList by default)
   *
   * In the mean time, we'll just split the mock data visually.
   */
  const fakeFetchMoreData = useCallback(() => {
    setFakeFetchingData(true);
    setTimeout(() => {
      setMockDataPager(mockDataPager + 1);
      setFakeFetchingData(false);
    }, 1500);
  }, [setFakeFetchingData, mockDataPager, setMockDataPager]);

  return (
    <div className={styles.main}>
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
        items={filteredActionsData.slice(0, mockDataPager * ITEMS_PER_PAGE)}
        handleItemClick={handleActionRedirect}
      />
      {mockDataPager * ITEMS_PER_PAGE < MOCK_ACTIONS.length && (
        <div className={styles.controls}>
          <Button
            appearance={{ size: 'medium', theme: 'primary' }}
            onClick={fakeFetchMoreData}
            text={MSG.loadMore}
            loading={fakeFetchingData}
          />
        </div>
      )}
    </div>
  );
};

ColonyActions.displayName = displayName;

export default ColonyActions;
