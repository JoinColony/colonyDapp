import React, { ComponentProps, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router';

import NavItem from './NavItem';

const MSG = defineMessages({
  linkTextActions: {
    id: 'dashboard.ColonyHome.ColonyNavigation.linkTextActions',
    defaultMessage: 'Actions',
  },
  linkTextEvents: {
    id: 'dashboard.ColonyHome.ColonyNavigation.linkTextEvents',
    defaultMessage: 'Events',
  },
  linkTextExtensions: {
    id: 'dashboard.ColonyHome.ColonyNavigation.linkTextExtensions',
    defaultMessage: 'Extensions',
  },
});

const displayName = 'dashboard.ColonyHome.ColonyNavigation';

const ColonyNavigation = () => {
  const { colonyName } = useParams<{ colonyName: string }>();

  /*
   * @TODO actually determine these
   * This can be easily inferred from the subgraph queries
   *
   * But for that we need to store the "current" count either in redux or
   * in local storage... or maybe a local resolver?
   *
   * Problem is I couldn't get @client resolvers to work with subgrap queries :(
   */
  const hasNewActions = false;
  const hasNewEvents = false;
  const hasNewExtensions = false;

  const items = useMemo<ComponentProps<typeof NavItem>[]>(
    () => [
      {
        linkTo: `/colony/${colonyName}`,
        showDot: hasNewActions,
        text: MSG.linkTextActions,
      },
      {
        linkTo: `/colony/${colonyName}/events`,
        showDot: hasNewEvents,
        text: MSG.linkTextEvents,
      },
      {
        exact: false,
        linkTo: `/colony/${colonyName}/extensions`,
        showDot: hasNewExtensions,
        text: MSG.linkTextExtensions,
      },
    ],
    [colonyName, hasNewActions, hasNewEvents, hasNewExtensions],
  );

  return (
    <nav role="navigation">
      {items.map((itemProps) => (
        <NavItem key={itemProps.linkTo} {...itemProps} />
      ))}
    </nav>
  );
};

ColonyNavigation.displayName = displayName;

export default ColonyNavigation;
