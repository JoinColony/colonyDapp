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
  linkExtraExtensions: {
    id: 'dashboard.ColonyNavigation.linkExtraExtensions',
    defaultMessage: 'Coming Soon',
  },
});

const displayName = 'dashboard.ColonyNavigation';

const ColonyNavigation = () => {
  const { colonyName } = useParams<{ colonyName: string }>();

  // @TODO actually determine these
  const hasNewActions = false;
  const hasNewEvents = true;
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
        // disabled: true,
        extra: MSG.linkExtraExtensions,
        linkTo: `/colony/${colonyName}/admin`,
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
