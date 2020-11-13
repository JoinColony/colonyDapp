import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { useColonyEventsQuery } from '~data/index';

import { Address } from '~types/index';
import ActionsList from '~core/ActionsList';
import UnclaimedTransfers from '~dashboard/UnclaimedTransfers';
import { Select, Form } from '~core/Fields';
import {
  EventFilterOptions,
  EventFilterSelectOptions,
} from '../shared/eventsFilter';
import { immutableSort } from '~utils/arrays';

import styles from './ColonyEvents.css';

const displayName = 'dashboard.ColonyEvents';

interface Props {
  colonyAddress: Address;
}

// Implement formating based on Event Type (or in resolver)
const formatColonyEvents = (events) => {
  return events;
};

const MSG = defineMessages({
  labelFilter: {
    id: 'dashboard.ColonyEvents.labelFilter',
    defaultMessage: 'Filter',
  },
});

const ColonyEvents = ({ colonyAddress }: Props) => {
  const { data, error } = useColonyEventsQuery({
    variables: { address: colonyAddress },
  });
  if (error) console.warn(error);

  const [events, setEvents] = useState([]);
  const [eventsFilter, setEventsFilter] = useState<string>(
    EventFilterOptions.NEWEST,
  );

  const sort = useCallback(
    (first: any, second: any) => {
      if (!(first && second)) return 0;

      return eventsFilter === EventFilterOptions.NEWEST
        ? second.createdAt - first.createdAt
        : first.createdAt - second.createdAt;
    },
    [eventsFilter],
  );

  useEffect(() => {
    if (data && data.colony.events) {
      setEvents(formatColonyEvents(data.colony.events));
    }
  }, [data]);

  const filteredEvents = useMemo(() => immutableSort(events, sort), [
    events,
    eventsFilter,
    sort,
  ]);

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
      <ActionsList items={filteredEvents} />
    </div>
  );
};

ColonyEvents.displayName = displayName;

export default ColonyEvents;
