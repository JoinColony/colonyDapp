import React, { ReactChild, useEffect } from 'react';

import { generatePath, useHistory } from 'react-router';
import { defineMessages } from 'react-intl';
import { useDialog } from '~core/Dialog';

import ColonyDomainSelector from '~dashboard/ColonyHome/ColonyDomainSelector';
import ColonyHomeActions from '~dashboard/ColonyHomeActions';
import ColonyTotalFunds from '~dashboard/ColonyTotalFunds';
import WrongNetworkDialog from '~dialogs/WrongNetworkDialog';

import { Colony, useLoggedInUser } from '~data/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import ColonyFunding from './ColonyFunding';
import ColonyUnclaimedTransfers from './ColonyUnclaimedTransfers';
import ColonyTitle from './ColonyTitle';
import ColonyNavigation from './ColonyNavigation';
import ColonyMembers from './ColonyMembers';
import ColonyExtensions from './ColonyExtensions';
import ColonyDomainDescription from './ColonyDomainDescription';
import ColonyUpgrade from './ColonyUpgrade';
import ColonyFinishDeployment from './ColonyFinishDeployment';
import ExtensionUpgrade from './ExtensionUpgrade';

import styles from './ColonyHomeLayout.css';
import Button from '~core/Button';
import { EXPENDITURE_ROUTE } from '~routes/routeConstants';

const MSG = defineMessages({
  newExpenditure: {
    id: 'dashboard.ColonyHomeLayout.newExpenditure',
    defaultMessage: 'New Expenditure',
  },
});

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
  showExpenditure?: boolean;
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
  showExpenditure,
}: Props) => {
  const { ethereal, networkId } = useLoggedInUser();
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const openWrongNetworkDialog = useDialog(WrongNetworkDialog);
  const history = useHistory();

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
        <aside className={styles.leftAside}>
          <ColonyTitle colony={colony} />
          {showNavigation && <ColonyNavigation colony={colony} />}
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
                  <ColonyHomeActions
                    colony={colony}
                    ethDomainId={ethDomainId}
                  />
                )}
                {showExpenditure && (
                  <Button
                    appearance={{ theme: 'primary', size: 'large' }}
                    text={MSG.newExpenditure}
                    onClick={() =>
                      history.push(
                        generatePath(EXPENDITURE_ROUTE, {
                          colonyName: colony.colonyName,
                        }),
                      )
                    }
                  />
                )}
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
