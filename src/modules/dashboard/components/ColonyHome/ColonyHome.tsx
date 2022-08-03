import React, { useState, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import {
  Redirect,
  Route,
  RouteChildrenProps,
  Switch,
  useParams,
} from 'react-router-dom';
import { parse as parseQS } from 'query-string';

import LoadingTemplate from '~pages/LoadingTemplate';
import Extensions, { ExtensionDetails } from '~dashboard/Extensions';
import ColonyHomeActions from '~dashboard/ColonyHomeActions';
import { allAllowedExtensions } from '~data/staticData/';

import ColonyActions from '~dashboard/ColonyActions';
import ColonyEvents from '~dashboard/ColonyEvents';
import ColonyDecisions from '~dashboard/ColonyDecisions';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useColonyFromNameQuery } from '~data/index';

import ColonyHomeLayout from './ColonyHomeLayout';
import styles from './ColonyHomeLayout.css';

import {
  COLONY_EVENTS_ROUTE,
  COLONY_DECISIONS_ROUTE,
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

type Props = RouteChildrenProps<{ colonyName: string; extensionId?: string }>;

const displayName = 'dashboard.ColonyHome';

const ColonyHome = ({ match, location }: Props) => {
  if (!match) {
    throw new Error(
      `No match found for route in ${displayName} Please check route setup.`,
    );
  }

  const { colonyName, extensionId } = useParams<{
    colonyName: string;
    extensionId?: string;
  }>();

  const { domainFilter: queryDomainFilterId } = parseQS(location.search) as {
    domainFilter: string | undefined;
  };

  const [domainIdFilter, setDomainIdFilter] = useState<number>(
    Number(queryDomainFilterId),
  );

  const filteredDomainId = domainIdFilter || COLONY_TOTAL_BALANCE_DOMAIN_ID;

  const { data, error, loading } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
    pollInterval: 5000,
  });
  if (error) console.error(error);

  const isExtensionIdValid = useMemo(
    // if no extensionId is provided, assume it's valid
    () => (extensionId ? allAllowedExtensions.includes(extensionId) : true),
    [extensionId],
  );

  const memoizedSwitch = useMemo(() => {
    if (data?.processedColony && isExtensionIdValid) {
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
                <ColonyEvents colony={colony} ethDomainId={filteredDomainId} />
              </ColonyHomeLayout>
            )}
          />
          <Route
            path={COLONY_DECISIONS_ROUTE}
            component={() => (
              <ColonyHomeLayout
                colony={colony}
                filteredDomainId={filteredDomainId}
                onDomainChange={setDomainIdFilter}
                newItemButton={
                  <ColonyHomeActions
                    colony={colony}
                    ethDomainId={filteredDomainId}
                  />
                }
              >
                <ColonyDecisions
                  colony={colony}
                  ethDomainId={filteredDomainId}
                />
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
            path={[
              COLONY_EXTENSION_DETAILS_ROUTE,
              COLONY_EXTENSION_SETUP_ROUTE,
            ]}
            render={(props) => (
              <ColonyHomeLayout
                colony={colony}
                filteredDomainId={filteredDomainId}
                onDomainChange={setDomainIdFilter}
                showControls={false}
                showSidebar={false}
              >
                <ExtensionDetails {...props} colony={colony} />
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
                newItemButton={
                  <ColonyHomeActions
                    colony={colony}
                    ethDomainId={filteredDomainId}
                  />
                }
              >
                <ColonyActions colony={colony} ethDomainId={filteredDomainId} />
              </ColonyHomeLayout>
            )}
          />
        </Switch>
      );
    }
    return null;
  }, [data, isExtensionIdValid, filteredDomainId]);

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
    (data?.processedColony && data.processedColony.colonyName !== colonyName) ||
    (data?.colonyAddress &&
      !data?.processedColony &&
      !((data.colonyAddress as any) instanceof Error))
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
    (data?.colonyAddress as any) instanceof Error ||
    !isExtensionIdValid
  ) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  return memoizedSwitch;
};

ColonyHome.displayName = displayName;

export default ColonyHome;
