import React, { useState, useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import ActionsList from '~core/ActionsList';
import UnclaimedTransfers from '~dashboard/UnclaimedTransfers';
import { SpinnerLoader } from '~core/Preloaders';
import { Select, Form } from '~core/Fields';

import {
  EventFilterOptions,
  EventFilterSelectOptions,
} from '../shared/eventsFilter';
import { immutableSort } from '~utils/arrays';
import { Colony, useSubgraphEventsQuery } from '~data/index';
import { getEventsListData } from '../../transformers';
import { useTransformer } from '~utils/hooks';

import ColonyEventsListItem from './ColonyEventsListItem';

import styles from './ColonyEvents.css';

const displayName = 'dashboard.ColonyEvents';

interface Props {
  colony: Colony;
}

const MSG = defineMessages({
  labelFilter: {
    id: 'dashboard.ColonyEvents.labelFilter',
    defaultMessage: 'Filter',
  },
});

const ColonyEvents = ({ colony: { colonyAddress }, colony }: Props) => {
  const [eventsFilter, setEventsFilter] = useState<string>(
    EventFilterOptions.NEWEST,
  );

  const {
    data,
    loading: subgraphEventsLoading,
    error,
  } = useSubgraphEventsQuery({
    variables: {
      colonyAddress: colonyAddress.toLowerCase(),
    },
  });

  if (error) console.error(error);

  const events = useTransformer(getEventsListData, [data]) || [];

  const sort = useCallback(
    (first: any, second: any) => {
      if (!(first && second)) return 0;

      return eventsFilter === EventFilterOptions.NEWEST
        ? second.createdAt - first.createdAt
        : first.createdAt - second.createdAt;
    },
    [eventsFilter],
  );

  const filteredEvents = useMemo(
    () =>
      immutableSort(events, sort).map((event) => {
        return {
          ...event,
          userAddress: event.userAddress || event.fromAddress,
        };
      }),
    [events, sort],
  );

  return (
    <div>
      <UnclaimedTransfers colonyAddress={colonyAddress} />
      <Form
        initialValues={{ filter: EventFilterOptions.NEWEST }}
        onSubmit={() => undefined}
      >
        <div className={styles.filter}>
          <Select
            appearance={{ alignOptions: 'left', theme: 'alt' }}
            elementOnly
            label={MSG.labelFilter}
            name="filter"
            options={EventFilterSelectOptions}
            onChange={setEventsFilter}
            placeholder={MSG.labelFilter}
          />
        </div>
      </Form>
      {subgraphEventsLoading ? (
        <SpinnerLoader />
      ) : (
        <ActionsList
          items={filteredEvents}
          colony={colony}
          itemComponent={ColonyEventsListItem}
        />
      )}
    </div>
  );
};

ColonyEvents.displayName = displayName;

export default ColonyEvents;
