import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ActionsListItem, ItemStatus } from '~core/ActionsList';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import ConfirmDeleteDialog from '~dashboard/Dialogs/ConfirmDeleteDialog';
import DecisionDialog from '~dashboard/Dialogs/DecisionDialog';

import { LOCAL_STORAGE_DECISION_KEY } from '~constants';
import { DecisionDetails } from '~types/index';
import { Colony, useLoggedInUser } from '~data/index';

import styles from './DraftDecisionItem.css';

const MSG = defineMessages({
  decision: {
    id: 'dashboard.ColonyDecisions.DraftDecisionItem.decision',
    defaultMessage: 'Decision',
  },
});

const displayName = 'dashboard.ColonyDecisions.DraftDecisionItem';

interface Props {
  colony: Colony;
}

const DraftDecisionItem = ({ colony, colony: { colonyName } }: Props) => {
  const history = useHistory();

  const [draftDecisionData] = useState<DecisionDetails | undefined>(
    localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) === null
      ? undefined
      : JSON.parse(localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) || ''),
  );
  const { username, ethereal, walletAddress } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;

  const redirectToPreview = () =>
    history.push(`/colony/${colonyName}/decisions/preview`);

  const openConfirmDeleteDialog = useDialog(ConfirmDeleteDialog);
  const openDecisionDialog = useDialog(DecisionDialog);
  const deleteDecision = () => {
    localStorage.removeItem(LOCAL_STORAGE_DECISION_KEY);
    history.push(`/colony/${colonyName}/decisions`);
  };

  return hasRegisteredProfile &&
    draftDecisionData &&
    draftDecisionData.userAddress === walletAddress ? (
    <ul className={styles.draftDecision}>
      <ActionsListItem
        item={{
          isDecision: true,
          initiator: walletAddress,
          status: ItemStatus.Yellow,
        }}
        handleOnClick={redirectToPreview}
        draftData={draftDecisionData}
        colony={colony}
        actions={
          <>
            <Button
              appearance={{ theme: 'blue' }}
              text={{ id: 'button.edit' }}
              onClick={(event) => {
                event.stopPropagation();
                openDecisionDialog({ colony, isNewDecision: false });
              }}
            />
            <Button
              appearance={{ theme: 'blue' }}
              text={{ id: 'button.delete' }}
              onClick={(event) => {
                event.stopPropagation();
                openConfirmDeleteDialog({
                  itemName: <FormattedMessage {...MSG.decision} />,
                  deleteCallback: deleteDecision,
                });
              }}
            />
          </>
        }
      />
    </ul>
  ) : null;
};

DraftDecisionItem.displayName = displayName;

export default DraftDecisionItem;
