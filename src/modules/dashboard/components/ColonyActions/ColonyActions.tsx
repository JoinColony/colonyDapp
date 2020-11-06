import React, { useCallback, useState, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import ActionsList, {
  ClickHandlerProps as RedirectHandlerProps,
} from '~core/ActionsList';
import { Select, Form } from '~core/Fields';

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

const ColonyActions = () => {
  const [actionsFilter, setActionsFilter] = useState<string>(
    ActionFilterOptions.ENDING_SOONEST,
  );

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
        items={filteredActionsData}
        handleItemClick={handleActionRedirect}
      />
    </div>
  );
};

ColonyActions.displayName = displayName;

export default ColonyActions;
