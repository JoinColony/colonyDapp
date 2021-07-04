import React, { ReactChild } from 'react';

import ColonyDomainSelector from '~dashboard/ColonyHome/ColonyDomainSelector';
import ColonyHomeActions from '~dashboard/ColonyHomeActions';
import ColonyTotalFunds from '~dashboard/ColonyTotalFunds';

import ColonyFunding from './ColonyFunding';
import ColonyTitle from './ColonyTitle';
import ColonyNavigation from './ColonyNavigation';
import ColonyMembers from './ColonyMembers';
import ColonyExtensions from './ColonyExtensions';
import ColonyDomainDescription from './ColonyDomainDescription';
import ColonyUpgrade from './ColonyUpgrade';
import ColonyFinishDeployment from './ColonyFinishDeployment';
import ExtensionUpgrade from './ExtensionUpgrade';

import { Colony } from '~data/index';

import styles from './ColonyHomeLayout.css';

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
  showActions?: boolean;
  ethDomainId?: number;
};

const displayName = 'dashboard.ColonyHome.ColonyHomeLayout';

const ColonyHomeLayout = ({
  colony,
  filteredDomainId,
  children,
  showControls = true,
  showNavigation = true,
  showSidebar = true,
  showActions = true,
  onDomainChange = () => null,
  ethDomainId,
}: Props) => (
  <div className={styles.main}>
    <div className={showSidebar ? styles.mainContentGrid : styles.minimalGrid}>
      <aside className={styles.leftAside}>
        <ColonyTitle colony={colony} />
        {showNavigation && <ColonyNavigation />}
      </aside>
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
              {showActions && (
                <ColonyHomeActions colony={colony} ethDomainId={ethDomainId} />
              )}
            </div>
          </>
        )}
        {children}
      </div>
      {showSidebar ? (
        <aside className={styles.rightAside}>
          <ColonyDomainDescription
            colony={colony}
            currentDomainId={filteredDomainId}
          />
          <ColonyFunding colony={colony} currentDomainId={filteredDomainId} />
          <ColonyMembers colony={colony} currentDomainId={filteredDomainId} />
          <ColonyExtensions colony={colony} />
        </aside>
      ) : (
        <aside />
      )}
    </div>
    <ColonyUpgrade colony={colony} />
    <ExtensionUpgrade colony={colony} />
    <ColonyFinishDeployment colony={colony} />
  </div>
);

ColonyHomeLayout.displayName = displayName;

export default ColonyHomeLayout;
