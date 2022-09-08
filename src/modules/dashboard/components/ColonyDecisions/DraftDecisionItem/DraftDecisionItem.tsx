import React, { useState } from 'react';

import { ActionsListItem } from '~core/ActionsList';
import { LOCAL_STORAGE_DECISION_KEY } from '~constants';
import { DecisionDetails } from '~types/index';
import { Colony, useLoggedInUser } from '~data/index';

import styles from './DraftDecisionItem.css';

interface Props {
  colony: Colony;
}

const DraftDecisionItem = ({ colony }: Props) => {
  const [draftDecisionData] = useState<DecisionDetails | undefined>(
    localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) === null
      ? undefined
      : JSON.parse(localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) || ''),
  );
  const { username, ethereal, walletAddress } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;

  return hasRegisteredProfile &&
    draftDecisionData &&
    draftDecisionData.userAddress === walletAddress ? (
    <ul className={styles.draftDecision}>
      <ActionsListItem
        item={{
          isDecision: true,
          initiator: walletAddress,
        }}
        draftData={draftDecisionData}
        colony={colony}
      />
    </ul>
  ) : null;
};

export default DraftDecisionItem;
