import React, { ReactChild } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Colony } from '~data/index';
import Alert from '~core/Alert';
import { DialogActionButton } from '~core/Button';
import NetworkContractUpgradeDialog from '~dashboard/NetworkContractUpgradeDialog';

import DomainDropdown from '~dashboard/DomainDropdown';
import ColonyHomeActions from '~dashboard/ColonyHomeActions';
import ColonyTotalFunds from '~dashboard/ColonyTotalFunds';

import ColonyFunding from './ColonyFunding';
import ColonyTitle from './ColonyTitle';
import ColonyNavigation from './ColonyNavigation';
import ColonyMembers from './ColonyMembers';
import ColonyExtensions from './ColonyExtensions';

import { ActionTypes } from '~redux/index';

import styles from './ColonyHomeLayout.css';

const MSG = defineMessages({
  upgradeRequired: {
    id: `dashboard.ColonyHome.ColonyLayout.upgradeRequired`,
    defaultMessage: `This colony uses a version of the network that is no
      longer supported. You must upgrade to continue using this application.`,
  },
});

type Props = {
  colony: Colony;
  filteredDomainId: number;
  onDomainChange?: (domainId: number) => void;
  canUpgradeColony?: boolean;
  mustUpgradeColony?: boolean;
  /*
   * This component should only be used with a child to render,
   * otherwise it has no point
   */
  children: ReactChild;
  showControls?: boolean;
  showNavigation?: boolean;
  showSidebar?: boolean;
};

const displayName = 'dashboard.ColonyHome.ColonyHomeLayout';

const ColonyHomeLayout = ({
  colony: { colonyAddress },
  colony,
  filteredDomainId,
  children,
  canUpgradeColony = false,
  mustUpgradeColony = false,
  showControls = true,
  showNavigation = true,
  showSidebar = true,
  onDomainChange = () => null,
}: Props) => (
  <div className={styles.main}>
    <ColonyTitle colony={colony} />
    <div className={showSidebar ? styles.mainContentGrid : styles.minimalGrid}>
      <aside className={styles.leftAside}>
        {showNavigation && <ColonyNavigation />}
      </aside>
      <div className={styles.mainContent}>
        {showControls && (
          <>
            <ColonyTotalFunds colony={colony} />
            <div className={styles.contentActionsPanel}>
              <div className={styles.domainsDropdownContainer}>
                <DomainDropdown
                  filteredDomainId={filteredDomainId}
                  colonyAddress={colonyAddress}
                  onDomainChange={onDomainChange}
                />
              </div>
              <ColonyHomeActions />
            </div>
          </>
        )}
        {children}
      </div>
      {showSidebar ? (
        <aside className={styles.rightAside}>
          <ColonyFunding colony={colony} currentDomainId={filteredDomainId} />
          <ColonyMembers colony={colony} currentDomainId={filteredDomainId} />
          <ColonyExtensions colony={colony} />
        </aside>
      ) : (
        <aside />
      )}
    </div>
    {!!mustUpgradeColony && (
      <div className={styles.upgradeBannerContainer}>
        <Alert
          appearance={{
            theme: 'danger',
            margin: 'none',
            borderRadius: 'none',
          }}
        >
          <div className={styles.upgradeBanner}>
            <FormattedMessage {...MSG.upgradeRequired} />
          </div>
          <DialogActionButton
            appearance={{ theme: 'primary', size: 'medium' }}
            text={{ id: 'button.upgrade' }}
            dialog={NetworkContractUpgradeDialog}
            submit={ActionTypes.COLONY_VERSION_UPGRADE}
            success={ActionTypes.COLONY_VERSION_UPGRADE_SUCCESS}
            error={ActionTypes.COLONY_VERSION_UPGRADE_ERROR}
            values={{ colonyAddress }}
            disabled={!canUpgradeColony}
          />
        </Alert>
      </div>
    )}
  </div>
);

ColonyHomeLayout.displayName = displayName;

export default ColonyHomeLayout;
