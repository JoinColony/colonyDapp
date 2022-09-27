import React, { ReactChild, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

import { useDialog } from '~core/Dialog';
import ColonyDomainSelector from '~dashboard/ColonyHome/ColonyDomainSelector';
import ColonyTotalFunds from '~dashboard/ColonyTotalFunds';
import WrongNetworkDialog from '~dialogs/WrongNetworkDialog';

import { Colony, useLoggedInUser } from '~data/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import ColonyFunding from './ColonyFunding';
import ColonyUnclaimedTransfers from './ColonyUnclaimedTransfers';
import ColonyHomeInfo from './ColonyHomeInfo';
import ColonyMembers from './ColonyMembers';
import ColonyExtensions from './ColonyExtensions';
import ColonyDomainDescription from './ColonyDomainDescription';
import ColonyUpgrade from './ColonyUpgrade';
import ColonyFinishDeployment from './ColonyFinishDeployment';
import ExtensionUpgrade from './ExtensionUpgrade';

import styles from './ColonyHomeLayout.css';
import { query700 as query } from '~styles/queries.css';

type Props = {
  colony: Colony;
  filteredDomainId: number;
  onDomainChange?: (domainId: number) => void;
  /*
   * This component should only be used with a child to render,
   * otherwise it has no point
   */
  children: ReactChild;
  showControls?: boolean;
  showNavigation?: boolean;
  showSidebar?: boolean;
  newItemButton?: ReactChild;
};

const displayName = 'dashboard.ColonyHome.ColonyHomeLayout';

const ColonyHomeLayout = ({
  colony,
  filteredDomainId,
  children,
  showControls = true,
  showNavigation = true,
  showSidebar = true,
  onDomainChange = () => null,
  newItemButton,
}: Props) => {
  const { ethereal, networkId } = useLoggedInUser();
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const openWrongNetworkDialog = useDialog(WrongNetworkDialog);
  const isMobile = useMediaQuery({ query });

  useEffect(() => {
    if (!ethereal && !isNetworkAllowed) {
      openWrongNetworkDialog();
    }
  }, [ethereal, isNetworkAllowed, openWrongNetworkDialog]);

  return (
    <div className={styles.main}>
      <div
        className={showSidebar ? styles.mainContentGrid : styles.minimalGrid}
      >
        <ColonyHomeInfo {...{ colony, isMobile, showNavigation }} />
        <div className={styles.mainContent}>
          {showControls && (
            <>
              <ColonyTotalFunds colony={colony} />
              <div className={styles.contentActionsPanel}>
                <div className={styles.domainsDropdownContainer}>
                  <ColonyDomainSelector
                    filteredDomainId={filteredDomainId}
                    onDomainChange={onDomainChange}
                    colony={colony}
                  />
                </div>
                {newItemButton}
                {/* {showActions && (
                  <ColonyHomeActions
                    colony={colony}
                    ethDomainId={ethDomainId}
                  />
                )} */}
              </div>
            </>
          )}
          {children}
        </div>
        {showSidebar && (
          <aside className={styles.rightAside}>
            <ColonyDomainDescription
              colony={colony}
              currentDomainId={filteredDomainId}
            />
            <ColonyUnclaimedTransfers colony={colony} />
            <ColonyFunding colony={colony} currentDomainId={filteredDomainId} />
            <ColonyMembers colony={colony} currentDomainId={filteredDomainId} />
            <ColonyExtensions colony={colony} />
          </aside>
        )}
      </div>
      <ColonyUpgrade colony={colony} />
      <ExtensionUpgrade colony={colony} />
      <ColonyFinishDeployment colony={colony} />
    </div>
  );
};

ColonyHomeLayout.displayName = displayName;

export default ColonyHomeLayout;
