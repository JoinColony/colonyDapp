import React from 'react';
import { useHistory } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';

import { ActionsListItem, ItemStatus } from '~core/ActionsList';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import ConfirmDeleteDialog from '~dashboard/Dialogs/ConfirmDeleteDialog';
import DecisionDialog from '~dashboard/Dialogs/DecisionDialog';

import { LOCAL_STORAGE_DECISION_KEY } from '~constants';
import { ColonyMotions, DecisionDetails } from '~types/index';
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
  draftDecision?: DecisionDetails;
  removeDraftDecision: () => void;
}

const DraftDecisionItem = ({
  colony,
  colony: { colonyName },
  draftDecision,
  removeDraftDecision,
}: Props) => {
  const history = useHistory();

  const { username, ethereal, walletAddress } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;

  const redirectToPreview = () =>
    history.push(`/colony/${colonyName}/decisions/preview`);

  const openConfirmDeleteDialog = useDialog(ConfirmDeleteDialog);
  const openDecisionDialog = useDialog(DecisionDialog);
  const deleteDecision = () => {
    localStorage.removeItem(LOCAL_STORAGE_DECISION_KEY);
    removeDraftDecision();
  };

  return hasRegisteredProfile &&
    draftDecision &&
    draftDecision.userAddress === walletAddress ? (
    <ul className={styles.draftDecision}>
      <ActionsListItem
        item={{
          isDecision: true,
          initiator: walletAddress,
          status: ItemStatus.Yellow,
          actionType: ColonyMotions.CreateDecisionMotion,
        }}
        handleOnClick={redirectToPreview}
        draftData={draftDecision}
        colony={colony}
        actions={
          <div className={styles.buttonContainer}>
            <Button
              appearance={{ theme: 'blue' }}
              text={{ id: 'button.delete' }}
              onClick={(event) => {
                event.stopPropagation();
                openConfirmDeleteDialog({
                  itemName: (
                    <FormattedMessage {...MSG.decision} key={nanoid()} />
                  ),
                  deleteCallback: deleteDecision,
                });
              }}
            />
            <Button
              appearance={{ theme: 'blue' }}
              text={{ id: 'button.edit' }}
              onClick={(event) => {
                event.stopPropagation();
                openDecisionDialog({ colony });
              }}
            />
          </div>
        }
      />
    </ul>
  ) : null;
};

DraftDecisionItem.displayName = displayName;

export default DraftDecisionItem;
