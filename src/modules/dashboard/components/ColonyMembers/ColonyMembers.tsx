import React, { useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import { useDialog } from '~core/Dialog';

import LoadingTemplate from '~pages/LoadingTemplate';
import Members from '~dashboard/Members';
import WrongNetworkDialog from '~dashboard/ColonyHome/WrongNetworkDialog';

import { useColonyFromNameQuery, useLoggedInUser } from '~data/index';
import { NOT_FOUND_ROUTE } from '~routes/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import MembersControls from './MembersControls';
import styles from './ColonyMembers.css';

const displayName = 'dashboard.ColonyMembers';

const MSG = defineMessages({
  loadingText: {
    id: 'dashboard.ColonyMembers.loadingText',
    defaultMessage: 'Loading Colony',
  },
  totalReputationTitle: {
    id: 'dashboard.ColonyMembers.totalReputationTitle',
    defaultMessage: 'Total reputation in team',
  },
});

const ColonyMembers = () => {
  const { networkId, ethereal } = useLoggedInUser();
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  const openWrongNetworkDialog = useDialog(WrongNetworkDialog);

  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData, error, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  useEffect(() => {
    if (!ethereal && !isNetworkAllowed) {
      openWrongNetworkDialog();
    }
  }, [ethereal, isNetworkAllowed, openWrongNetworkDialog]);

  if (
    loading ||
    (colonyData?.colonyAddress &&
      !colonyData.processedColony &&
      !((colonyData.colonyAddress as any) instanceof Error))
  ) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (!colonyName || error || !colonyData?.processedColony) {
    console.error(error);
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.mainContentGrid}>
        <div className={styles.mainContent}>
          {colonyData && colonyData.processedColony && (
            <Members colony={colonyData.processedColony} />
          )}
        </div>
        <aside className={styles.rightAside}>
          <MembersControls colony={colonyData.processedColony} />
        </aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
