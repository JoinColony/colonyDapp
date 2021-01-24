import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import TokenEditDialog from '~core/TokenEditDialog';
import { Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { useAsyncFunction } from '~utils/hooks';

import getTokenList from './getTokenList';

interface Props {
  colony: Colony;
  cancel: () => void;
  close: () => void;
}

const displayName = 'dashboard.ColonyTokenManagementDialog';

const updateTokensAction = {
  submit: ActionTypes.COLONY_ACTION_EDIT_COLONY,
  error: ActionTypes.COLONY_ACTION_EDIT_COLONY_ERROR,
  success: ActionTypes.COLONY_ACTION_EDIT_COLONY_SUCCESS,
};

const ColonyTokenManagementDialog = ({
  colony: {
    colonyAddress,
    colonyName,
    displayName: colonyDisplayName,
    avatarURL,
  },
  colony,
  cancel,
  close,
}: Props) => {
  const history = useHistory();

  const transform = useCallback(
    pipe(
      mapPayload(({ tokenAddresses, annotationMessage }) => ({
        colonyAddress,
        colonyName,
        colonyDisplayName,
        colonyAvatarImage: avatarURL,
        colonyTokens: tokenAddresses,
        annotationMessage,
      })),
      withMeta({ history }),
    ),
    [],
  );

  const updateTokens = useAsyncFunction({
    ...updateTokensAction,
    transform,
  }) as any;

  return (
    <TokenEditDialog
      cancel={cancel}
      close={close}
      colony={colony}
      updateTokens={updateTokens}
      tokensList={getTokenList}
    />
  );
};

ColonyTokenManagementDialog.displayName = displayName;

export default ColonyTokenManagementDialog;
