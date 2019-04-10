/* @flow */

// $FlowFixMe until hooks flow types
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import compose from 'lodash/fp/compose';

import type { Address } from '~types';

import { mergePayload, withKeyPath } from '~utils/actions';
import { ACTIONS } from '~redux';

import { colonyRecentTokensSelector } from '../../../dashboard/selectors';

import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
} from '../../actionCreators';

import TokenEditDialog from './TokenEditDialog.jsx';

type Props = {|
  cancel: () => void,
  close: () => void,
  selectedTokens: string[],
  colonyAddress: Address,
|};

const ColonyTokenEditDialog = ({
  selectedTokens = [],
  colonyAddress,
  cancel,
  close,
}: Props) => {
  // refetch recent colony transactions, used to populate token options
  const dispatch = useDispatch();
  useEffect(
    () => {
      dispatch(fetchColonyTransactions(colonyAddress));
      dispatch(fetchColonyUnclaimedTransactions(colonyAddress));
    },
    [dispatch, colonyAddress],
  );

  // fetch token options with selector
  const mapAvailableTokens = useCallback(
    state => colonyRecentTokensSelector(state, colonyAddress),
    [colonyAddress],
  );
  const availableTokens = useMappedState(mapAvailableTokens);

  return (
    <TokenEditDialog
      cancel={cancel}
      close={close}
      availableTokens={availableTokens}
      selectedTokens={selectedTokens}
      submit={ACTIONS.COLONY_UPDATE_TOKENS}
      error={ACTIONS.COLONY_UPDATE_TOKENS_ERROR}
      success={ACTIONS.COLONY_UPDATE_TOKENS_SUCCESS}
      transform={compose(
        withKeyPath(colonyAddress),
        mergePayload({ colonyAddress }),
      )}
    />
  );
};

export default ColonyTokenEditDialog;
