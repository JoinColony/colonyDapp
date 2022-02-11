import React, { useState, useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import ActionsList from '~core/ActionsList';
import UnclaimedTransfers from '~dashboard/UnclaimedTransfers';
import { SpinnerLoader } from '~core/Preloaders';
import { Select, Form } from '~core/Fields';
import LoadMoreButton from '~core/LoadMoreButton';

import { SortOptions, SortSelectOptions } from '../shared/sortOptions';
import { immutableSort } from '~utils/arrays';
import {
  Colony,
  useSubgraphEventsSubscription,
  SubgraphEventsSubscription,
} from '~data/index';
import { getEventsListData } from '~modules/dashboard/transformers';
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
  const ITEMS_PER_PAGE = 10;

  const [eventsSort, setEventsSort] = useState<string>(SortOptions.NEWEST);
  const [dataPage, setDataPage] = useState<number>(1);
  const [streamedEvents, setStreamedEvents] = useState<
    SubgraphEventsSubscription['events']
  >([]);

  /*
   * @NOTE This would be better served as a query
   * As it stands, this would be better if we converted it back to being a query
   * with a proper cache update policy, rather than a more, expensive, subscription
   */
  const {
    data,
    loading: subgraphEventsLoading,
    error,
  } = useSubgraphEventsSubscription({
    variables: {
      skip: dataPage === 1 ? 0 : ITEMS_PER_PAGE * dataPage,
      first: ITEMS_PER_PAGE,
      colonyAddress: colonyAddress.toLowerCase(),
      sortDirection: 'desc',
    },
    onSubscriptionData: ({ subscriptionData: { data: newSubscriptionData } }) =>
      setStreamedEvents([
        ...streamedEvents,
        ...(newSubscriptionData?.events || []),
      ]),
  });

  if (error) console.error(error);

  const events =
    useTransformer(getEventsListData, [{ events: streamedEvents }]) || [];

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

  /* Remove duplicate events */
  const mappedEvents = events?.map((event) => event.id);
  const uniqueEvents = events?.filter(
    (event, index) => mappedEvents.indexOf(event.id) === index,
  );

  const filteredEvents = useMemo(
    () =>
      !ethDomainId
        ? uniqueEvents
        : uniqueEvents?.filter(
            (event) =>
              Number(event.domainId) === ethDomainId ||
              /* when no specific domain in the event it is displayed in Root */
              (ethDomainId === 1 &&
                event.domainId === null &&
                event.fundingPot === undefined),
          ),
    [ethDomainId, uniqueEvents],
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
          items={sortedEvents}
          colony={colony}
          itemComponent={ColonyEventsListItem}
        />
      )}
      {!!data?.events?.length && (
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
