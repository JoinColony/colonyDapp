import React from 'react';
import { useColonyEventsQuery } from '~data/index';
import { Address } from '~types/index';

const displayName = 'dashboard.ColonyEvents';

interface Props {
  colonyAddress: Address;
}

const ColonyEvents = ({ colonyAddress }: Props) => {
  const { data: transactionsData, error } = useColonyEventsQuery({
    variables: { address: colonyAddress },
  });
  console.log(transactionsData);

  return <div>Events</div>;
};

ColonyEvents.displayName = displayName;

export default ColonyEvents;
