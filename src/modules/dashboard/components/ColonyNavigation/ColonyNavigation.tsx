import React, { ComponentProps, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router';

import NavItem from './NavItem';

const MSG = defineMessages({
  linkTextActions: {
    id: 'dashboard.ColonyNavigation.linkTextActions',
    defaultMessage: 'Actions',
  },
  linkTextEvents: {
    id: 'dashboard.ColonyNavigation.linkTextEvents',
    defaultMessage: 'Events',
  },
  linkTextExtensions: {
    id: 'dashboard.ColonyNavigation.linkTextExtensions',
    defaultMessage: 'Extensions',
  },
  comingSoonMessage: {
    id: 'dashboard.ColonyNavigation.comingSoonMessage',
    defaultMessage: 'Coming Soon',
  },
});

const displayName = 'dashboard.ColonyNavigation';

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
        /*
         * @NOTE Disabled until we find a way to fetch them from the
         * subgraph. The current way of fetching them from chain is
         * sub-optimal and slow
         */
        disabled: true,
        extra: MSG.comingSoonMessage,
        linkTo: `/colony/${colonyName}/events`,
        showDot: hasNewEvents,
        text: MSG.linkTextEvents,
      },
      {
        disabled: true,
        extra: MSG.comingSoonMessage,
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
