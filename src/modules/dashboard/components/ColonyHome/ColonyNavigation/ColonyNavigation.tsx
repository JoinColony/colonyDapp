import React, { ComponentProps, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { Colony } from '~data/index';

import NavItem from './NavItem';

import styles from './ColonyNavigation.css';

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
  linkTextUnwrapTokens: {
    id: 'dashboard.ColonyHome.ColonyNavigation.linkTextUnwrapTokens',
    defaultMessage: 'Unwrap Tokens',
  },
  linkTextClaimTokens: {
    id: 'dashboard.ColonyHome.ColonyNavigation.linkTextClaimTokens',
    defaultMessage: 'Claim Tokens',
  },
  comingSoonMessage: {
    id: 'dashboard.ColonyNavigation.comingSoonMessage',
    defaultMessage: 'Coming Soon',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyHome.ColonyNavigation';

const ColonyNavigation = ({ colony: { colonyName } }: Props) => {
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
  const hasNewExtensions = false;

  const items = useMemo<ComponentProps<typeof NavItem>[]>(() => {
    const navigationItems: ComponentProps<typeof NavItem>[] = [
      {
        linkTo: `/colony/${colonyName}`,
        showDot: hasNewActions,
        text: MSG.linkTextActions,
      },
      {
        exact: false,
        linkTo: `/colony/${colonyName}/extensions`,
        showDot: hasNewExtensions,
        text: MSG.linkTextExtensions,
        dataTest: 'extensionsNavigationButton',
      },
    ];

    return navigationItems;
  }, [colonyName, hasNewActions, hasNewExtensions]);

  return (
    <nav role="navigation" className={styles.main}>
      {items.map((itemProps) => (
        <NavItem key={itemProps.linkTo} {...itemProps} />
      ))}
    </nav>
  );
};

ColonyNavigation.displayName = displayName;

export default ColonyNavigation;
