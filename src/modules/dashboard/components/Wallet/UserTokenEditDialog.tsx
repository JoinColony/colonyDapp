import React, { useEffect } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { UserTokenReferenceType } from '~immutable/index';
import { Address } from '~types/strings';
import { ActionTypes } from '~redux/index';
import { currentUserRecentTokensSelector } from '../../../users/selectors';

import { userTokenTransfersFetch } from '../../../users/actionCreators';

import TokenEditDialog from '~core/TokenEditDialog';

interface Props {
  cancel: () => void;
  close: () => void;
  selectedTokens: Address[];
}

const UserTokenEditDialog = ({ selectedTokens = [], cancel, close }: Props) => {
  // refetch recent user transactions, used to populate token options
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userTokenTransfersFetch());
  }, [dispatch]);

  const availableTokens = useMappedState(
    currentUserRecentTokensSelector,
  ) as UserTokenReferenceType[];

  return (
    <TokenEditDialog
      cancel={cancel}
      close={close}
      availableTokens={availableTokens}
      selectedTokens={selectedTokens}
      submit={ActionTypes.USER_TOKENS_UPDATE}
      error={ActionTypes.USER_TOKENS_UPDATE_ERROR}
      success={ActionTypes.USER_TOKENS_UPDATE_SUCCESS}
    />
  );
};

export default UserTokenEditDialog;
