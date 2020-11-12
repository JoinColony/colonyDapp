import React, { useState, useEffect } from 'react';
import { useColonyEventsQuery } from '~data/index';
import { Address } from '~types/index';
import ActionsList from '~core/ActionsList';

const displayName = 'dashboard.ColonyEvents';

interface Props {
  colonyAddress: Address;
}

const formatColonyEvents = (events) => {
  return events;
};

const ColonyEvents = ({ colonyAddress }: Props) => {
  const { data, error } = useColonyEventsQuery({
    variables: { address: colonyAddress },
  });

  const [events, setEvents] = useState([]);

  if (error) console.warn(error);

  useEffect(() => {
    if (data && data.colony.events) {
      setEvents(formatColonyEvents(data.colony.events));
    }
  }, [data]);

  return (
    <div>
      <ActionsList items={events} />
    </div>
  );
};

ColonyEvents.displayName = displayName;

export default ColonyEvents;
