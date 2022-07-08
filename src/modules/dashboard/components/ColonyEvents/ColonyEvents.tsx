import React, { useState, useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ActionsList from '~core/ActionsList';
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
import NavLink from '~core/NavLink';
import Link from '~core/Link';

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

  transactionsLogTitle: {
    id: 'dashboard.ColonyEvents.transactionsLogTitle',
    defaultMessage: 'Transactions log',
  },
  actionsLink: {
    id: 'dashboard.ColonyEvents.actionsLink',
    defaultMessage: 'Back to actions',
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
        ...new Set([...streamedEvents, ...(newSubscriptionData?.events || [])]),
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

  const filteredEvents = useMemo(
    () =>
      !ethDomainId
        ? events
        : events?.filter(
            (event) =>
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

  return (
    <div className={styles.main}>
      <div className={styles.bar}>
        <div className={styles.title}>
          <FormattedMessage {...MSG.transactionsLogTitle} />
        </div>
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

        <NavLink to={`/colony/${colony.colonyName}`} />

        <Link className={styles.link} to={`/colony/${colony.colonyName}`}>
          <FormattedMessage {...MSG.actionsLink} />
        </Link>
      </div>
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
