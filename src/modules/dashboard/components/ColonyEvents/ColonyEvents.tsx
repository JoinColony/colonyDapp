import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { Colony, useColonyEventsQuery, NetworkEvent } from '~data/index';

import styles from './ColonyEvents.css';

const displayName = 'dashboard.ColonyEvents';

interface Props {
  colony: Colony;
}

// Implement formating based on Event Type (or in resolver)
const formatColonyEvents = (events: NetworkEvent[]) => {
  return events;
};

const MSG = defineMessages({
  labelFilter: {
    id: 'dashboard.ColonyEvents.labelFilter',
    defaultMessage: 'Filter',
  },
});

const ColonyEvents = ({ colony: { colonyAddress }, colony }: Props) => {
  const { data, error, loading } = useColonyEventsQuery({
    variables: { address: colonyAddress },
  });
  if (error) console.warn(error);

  const [events, setEvents] = useState<NetworkEvent[]>([]);
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
    if (data && data.processedColony.events) {
      setEvents(formatColonyEvents(data.processedColony.events));
    }
  }, [data]);

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
      {loading ? (
        <SpinnerLoader />
      ) : (
        <ActionsList items={filteredEvents} colony={colony} />
      )}
    </div>
  );
};

ColonyEvents.displayName = displayName;

export default ColonyEvents;
