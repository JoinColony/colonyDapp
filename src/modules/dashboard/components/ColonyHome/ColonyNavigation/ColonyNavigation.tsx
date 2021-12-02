import React, { ComponentProps, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { Extension } from '@colony/colony-js';

import { useColonyExtensionsQuery, Colony } from '~data/index';
import { METACOLONY_ENS } from '~constants';

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
  linkTextCoinMachine: {
    id: 'dashboard.ColonyHome.ColonyNavigation.linkTextCoinMachine',
    defaultMessage: 'Buy Tokens',
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

const ColonyNavigation = ({ colony: { colonyAddress, colonyName } }: Props) => {
  const { data } = useColonyExtensionsQuery({
    variables: { address: colonyAddress },
  });
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

  const items = useMemo<ComponentProps<typeof NavItem>[]>(() => {
    const navigationItems: ComponentProps<typeof NavItem>[] = [
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
    ];
    if (data?.processedColony?.installedExtensions) {
      const { installedExtensions } = data.processedColony;
      const coinMachineExtension = installedExtensions.find(
        ({ extensionId }) => extensionId === Extension.CoinMachine,
      );
      /*
       * Only show the Buy Tokens navigation link if the Coin Machine extension is:
       * - installed
       * - enable
       * - not deprecated
       */
      if (
        coinMachineExtension &&
        coinMachineExtension?.details?.initialized &&
        !coinMachineExtension?.details?.deprecated
      ) {
        navigationItems.push({
          linkTo: `/colony/${colonyName}/buy-tokens`,
          showDot: false,
          text: MSG.linkTextCoinMachine,
        });
      }
    }

    if (colonyName === METACOLONY_ENS) {
      navigationItems.push(
        ...[
          {
            linkTo: `/colony/${colonyName}/unwrap-tokens`,
            showDot: false,
            text: MSG.linkTextUnwrapTokens,
            disabled: true,
          },
          {
            linkTo: `/colony/${colonyName}/claim-tokens`,
            showDot: false,
            text: MSG.linkTextClaimTokens,
            disabled: true,
          },
        ],
      );
    }

    return navigationItems;
  }, [colonyName, hasNewActions, hasNewEvents, hasNewExtensions, data]);

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
