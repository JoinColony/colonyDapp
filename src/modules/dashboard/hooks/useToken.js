/* @flow */

// $FlowFixMe until we have new react flow types with hooks
import { useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import type { Address } from '~types';
import type { TokenType } from '~immutable';

import { ACTIONS } from '~redux';
import { tokenWithIconSelector } from '../selectors';

const useToken = (tokenAddress: Address): ?TokenType => {
  const dispatch = useDispatch();
  const fetchToken = useCallback(
    () =>
      dispatch({ type: ACTIONS.TOKEN_INFO_FETCH, payload: { tokenAddress } }),
    [dispatch, tokenAddress],
  );
  const mapState = useCallback(
    state => ({
      token: tokenWithIconSelector(state, tokenAddress),
    }),
    [tokenAddress],
  );
  const { token } = useMappedState(mapState);
  if (!token) fetchToken();
  return token && token.toJS();
};

export default useToken;
