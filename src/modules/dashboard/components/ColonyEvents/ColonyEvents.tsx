import React, { useState, useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import ActionsList from '~core/ActionsList';
import UnclaimedTransfers from '~dashboard/UnclaimedTransfers';
import { SpinnerLoader } from '~core/Preloaders';
import { Select, Form } from '~core/Fields';

import {
  EventsSortOptions,
  EventsSortSelectOptions,
} from '../shared/eventsSort';
import { immutableSort } from '~utils/arrays';
import { Colony, useSubgraphEventsQuery } from '~data/index';
import { ColonyAndExtensionsEvents } from '~types/index';
import { useTransformer } from '~utils/hooks';

import { getEventsListData } from '../../transformers';

import ColonyEventsListItem from './ColonyEventsListItem';

import styles from './ColonyEvents.css';

const displayName = 'dashboard.ColonyEvents';

interface Props {
  colony: Colony;
  ethDomainId?: number;
}

const MSG = defineMessages({
  labelFilter: {
    id: 'dashboard.ColonyEvents.labelFilter',
    defaultMessage: 'Filter',
  },
});

const ColonyEvents = ({
  colony: { colonyAddress },
  colony,
  ethDomainId,
}: Props) => {
  const [eventsSort, setEventsSort] = useState<string>(
    EventsSortOptions.NEWEST,
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

      return eventsSort === EventsSortOptions.NEWEST
        ? second.createdAt - first.createdAt
        : first.createdAt - second.createdAt;
    },
    [eventsSort],
  );

  /* Needs to be tested when all event types are wirde up & reflected in the list */
  const filtereEvents = useMemo(
    () =>
      !ethDomainId
        ? events
        : events.filter((event) => {
            const displayValues = JSON.parse(event.displayValues);
            return (
              Number(event.fundingPot) === ethDomainId ||
              Number(displayValues.fromPot) === ethDomainId ||
              Number(event.domainId) === ethDomainId ||
              /* when transfering funds the list shows both sender & recipient */
              (event.eventName ===
                ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots &&
                Number(displayValues.toPot) === ethDomainId) ||
              /* when no specific domain in the event it is displayed in Root */
              (ethDomainId === 1 && event.domainId === undefined)
            );
          }),
    [ethDomainId, events],
  );

  const sortedEvents = useMemo(
    () =>
      immutableSort(filtereEvents, sort).map((event) => {
        return {
          ...event,
          userAddress: event.userAddress || event.fromAddress,
        };
      }),
    [filtereEvents, sort],
  );

  return (
    <div>
      <UnclaimedTransfers colony={colony} />
      <Form
        initialValues={{ filter: EventsSortOptions.NEWEST }}
        onSubmit={() => undefined}
      >
        <div className={styles.filter}>
          <Select
            appearance={{ alignOptions: 'left', theme: 'alt' }}
            elementOnly
            label={MSG.labelFilter}
            name="filter"
            options={EventsSortSelectOptions}
            onChange={setEventsSort}
            placeholder={MSG.labelFilter}
          />
        </div>
      </Form>
      {subgraphEventsLoading && !sortedEvents ? (
        <SpinnerLoader />
      ) : (
        <ActionsList
          items={sortedEvents}
          colony={colony}
          itemComponent={ColonyEventsListItem}
        />
      )}
    </div>
  );
};

ColonyEvents.displayName = displayName;

export default ColonyEvents;
