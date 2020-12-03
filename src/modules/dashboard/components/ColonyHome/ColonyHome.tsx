import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { Redirect, Route, RouteChildrenProps, Switch, useParams } from 'react-router-dom';
import { parse as parseQS } from 'query-string';

import LoadingTemplate from '~pages/LoadingTemplate';
import Extensions, { ExtensionDetails } from '~dashboard/Extensions';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyFromNameQuery } from '~data/index';

import ColonyActions from '~dashboard/ColonyActions';
import ColonyEvents from '~dashboard/ColonyEvents';

import ColonyHomeLayout from './ColonyHomeLayout';

import {
  COLONY_EVENTS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
  COLONY_EXTENSION_SETUP_ROUTE,
  COLONY_HOME_ROUTE,
  NOT_FOUND_ROUTE,
} from '~routes/index';

const MSG = defineMessages({
  loadingText: {
    id: 'dashboard.ColonyHome.loadingText',
    defaultMessage: 'Loading Colony',
  },
});

type Props = RouteChildrenProps<{ colonyName: string }>;

const displayName = 'dashboard.ColonyHome';

const ColonyHome = ({ match, location }: Props) => {
  if (!match) {
    throw new Error(
      `No match found for route in ${displayName} Please check route setup.`,
    );
  }

  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { domainFilter: queryDomainFilterId } = parseQS(location.search) as {
    domainFilter: string | undefined;
  };

  const [domainIdFilter, setDomainIdFilter] = useState<number>(
    Number(queryDomainFilterId),
  );

  const filteredDomainId = domainIdFilter || COLONY_TOTAL_BALANCE_DOMAIN_ID;

  const {
    data,
    error,
    loading,
    /**
     * @NOTE Hooking into the return variable value
     *
     * Since this is a client side query it's return value will never end up
     * in the final result from the main query hook, either the value or the
     * eventual error.
     *
     * For this we hook into the `address` value which will be set internally
     * by the `@client` query so that we can act on it if we encounter an ENS
     * error.
     *
     * Based on that error we can determine if the colony is registered or not.
     */
    variables: dataVariables,
  } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });

  if (error) console.error(error);

  /*
   * Keep the page loaded when the colony name changes, but we have data
   *
   * This can happen if changing the colony from the left subscriptions sidebar
   * The data won't change, hence not trigger the "loading" check, until it is
   * fetched and refreshed in the background.
   *
   * What this looks like in practice is that you change the colony but you'll
   * see the "old" colony's data on the page, up until it is just changed in
   * front of you.
   *
   * This problem is made even worse in an production environment where loading
   * times are slow.
   */
  if (
    loading ||
    (data?.processedColony && data.processedColony.colonyName !== colonyName)
  ) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (
    !colonyName ||
    error ||
    !data?.processedColony ||
    (data?.colonyAddress as any) instanceof Error
  ) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  const { processedColony: colony } = data;
  const { colonyAddress } = colony;

  return (
    <Switch>
      <Route
        path={COLONY_EVENTS_ROUTE}
        component={() => (
          <ColonyHomeLayout
            colony={colony}
            filteredDomainId={filteredDomainId}
            onDomainChange={setDomainIdFilter}
          >
            <ColonyEvents colony={colony} ethDomainId={domainIdFilter} />
          </ColonyHomeLayout>
        )}
      />
      <Route
        exact
        path={COLONY_EXTENSIONS_ROUTE}
        render={(props) => (
          <ColonyHomeLayout
            colony={colony}
            filteredDomainId={filteredDomainId}
            onDomainChange={setDomainIdFilter}
            showControls={false}
            showSidebar={false}
          >
            <Extensions {...props} colonyAddress={colonyAddress} />
          </ColonyHomeLayout>
        )}
      />
      <Route
        exact
        path={[COLONY_EXTENSION_DETAILS_ROUTE, COLONY_EXTENSION_SETUP_ROUTE]}
        render={(props) => (
          <ColonyHomeLayout
            colony={colony}
            filteredDomainId={filteredDomainId}
            onDomainChange={setDomainIdFilter}
            showControls={false}
            showSidebar={false}
          >
            <ExtensionDetails {...props} colonyAddress={colonyAddress} />
          </ColonyHomeLayout>
        )}
      />
      <Route
        path={COLONY_HOME_ROUTE}
        component={() => (
          <ColonyHomeLayout
            colony={colony}
            filteredDomainId={filteredDomainId}
            onDomainChange={setDomainIdFilter}
          >
            <ColonyActions colony={colony} ethDomainId={domainIdFilter} />
          </ColonyHomeLayout>
        )}
      />
    </Switch>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
