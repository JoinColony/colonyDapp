/* @flow */

// $FlowFixMe until we have new react flow types with hooks
import { useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { colonyENSNameSelector } from '../../selectors';
import { fetchColonyENSName as fetchColonyENSNameActionCreator } from '../../actionCreators';

import type { Address } from '~types';

/*
 * PLEASE NOTE: this hook is temporary and should be removed once we can lookup
 * colonies by address (rather than ensName) - #1032
 */

const useColonyENSName = (address: Address) => {
  const dispatch = useDispatch();
  const fetchColonyENSName = useCallback(
    () => dispatch(fetchColonyENSNameActionCreator(address)),
    [address, dispatch],
  );
  const mapState = useCallback(
    state => ({
      ensName: colonyENSNameSelector(state, { colonyAddress: address }),
    }),
    [address],
  );
  const { ensName } = useMappedState(mapState);
  if (!ensName) fetchColonyENSName();
  // we use split becuase we get the whole mycolony.colony.joincolony.eth
  return ensName && ensName.split('.')[0];
};

export default useColonyENSName;
