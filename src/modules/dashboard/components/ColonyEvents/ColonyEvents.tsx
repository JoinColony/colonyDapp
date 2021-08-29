import React, { useState, useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import ActionsList from '~core/ActionsList';
import UnclaimedTransfers from '~dashboard/UnclaimedTransfers';
import { SpinnerLoader } from '~core/Preloaders';
import { Select, Form } from '~core/Fields';
import LoadMoreButton from '~core/LoadMoreButton';

import { SortOptions, SortSelectOptions } from '../shared/sortOptions';
import { immutableSort } from '~utils/arrays';
import { Colony, useSubgraphEventsSubscription } from '~data/index';
import { getEventsListData } from '../../transformers';
import { useTransformer } from '~utils/hooks';

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
  const [eventsSort, setEventsSort] = useState<string>(SortOptions.NEWEST);

  const [dataPage, setDataPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;

  const {
    data,
    loading: subgraphEventsLoading,
    error,
  } = useSubgraphEventsSubscription({
    variables: {
      skip: 0,
      first: 100,
      colonyAddress: colonyAddress.toLowerCase(),
    },
  });

  if (error) console.error(error);

  const events = useTransformer(getEventsListData, [data]) || [];

  const sort = useCallback(
    (first: any, second: any) => {
      if (!(first && second)) return 0;

      return eventsSort === SortOptions.NEWEST
        ? second.createdAt - first.createdAt
        : first.createdAt - second.createdAt;
    },
    [eventsSort],
  );

  const handleDataPagination = useCallback(() => {
    setDataPage(dataPage + 1);
  }, [dataPage]);

  /* Needs to be tested when all event types are wirde up & reflected in the list */
  const filteredEvents = useMemo(
    () =>
      !ethDomainId
        ? events
        : events.filter(
            (event) =>
              // Number(event.fundingPot) === ethDomainId ||
              Number(event.domainId) === ethDomainId ||
              /* when no specific domain in the event it is displayed in Root */
              (ethDomainId === 1 &&
                event.domainId === null &&
                event.fundingPot === undefined),
          ),
    [ethDomainId, events],
  );

  const sortedEvents = useMemo(
    () =>
      immutableSort(filteredEvents, sort).map((event) => {
        return {
          ...event,
          userAddress: event.userAddress || event.fromAddress,
        };
      }),
    [filteredEvents, sort],
  );

  const paginatedEvents = sortedEvents.slice(0, ITEMS_PER_PAGE * dataPage);

  return (
    <div>
      <UnclaimedTransfers colony={colony} />
      <Form
        initialValues={{ filter: SortOptions.NEWEST }}
        onSubmit={() => undefined}
      >
        <div className={styles.filter}>
          <Select
            appearance={{ alignOptions: 'left', theme: 'alt' }}
            elementOnly
            label={MSG.labelFilter}
            name="filter"
            options={SortSelectOptions}
            onChange={setEventsSort}
            placeholder={MSG.labelFilter}
          />
        </div>
      </Form>
      {subgraphEventsLoading && !sortedEvents ? (
        <SpinnerLoader />
      ) : (
        <ActionsList
          items={paginatedEvents}
          colony={colony}
          itemComponent={ColonyEventsListItem}
        />
      )}
      {ITEMS_PER_PAGE * dataPage < sortedEvents.length && (
        <LoadMoreButton
          onClick={handleDataPagination}
          isLoadingData={subgraphEventsLoading}
        />
      )}
    </div>
  );
};

ColonyEvents.displayName = displayName;

export default ColonyEvents;
