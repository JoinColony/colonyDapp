/* @flow */

// $FlowFixMe until hooks flow types
import React, { useEffect } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { ACTIONS } from '~redux';

import { currentUserRecentTokensSelector } from '../../../users/selectors';

import { userTokenTransfersFetch } from '../../../users/actionCreators';

import { TokenEditDialog } from '~admin/Tokens';

type Props = {|
  cancel: () => void,
  close: () => void,
  selectedTokens: string[],
|};

const UserTokenEditDialog = ({ selectedTokens = [], cancel, close }: Props) => {
  // refetch recent user transactions, used to populate token options
  const dispatch = useDispatch();
  useEffect(
    () => {
      dispatch(userTokenTransfersFetch());
    },
    [dispatch],
  );

  // fetch token options with selector
  const availableTokens = useMappedState(currentUserRecentTokensSelector);

  return (
    <TokenEditDialog
      cancel={cancel}
      close={close}
      availableTokens={availableTokens}
      selectedTokens={selectedTokens}
      submit={ACTIONS.USER_TOKENS_UPDATE}
      error={ACTIONS.USER_TOKENS_UPDATE_ERROR}
      success={ACTIONS.USER_TOKENS_UPDATE_SUCCESS}
    />
  );
};

export default UserTokenEditDialog;
