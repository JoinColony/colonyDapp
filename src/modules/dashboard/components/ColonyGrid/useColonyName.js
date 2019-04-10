/* @flow */

// $FlowFixMe until we have new react flow types with hooks
import { useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import { colonyNameSelector } from '../../selectors';
import { fetchColonyName as fetchColonyNameActionCreator } from '../../actionCreators';

import type { Address } from '~types';

/*
 * PLEASE NOTE: this hook is temporary and should be removed once we can lookup
 * colonies by address (rather than colonyName) - #1032
 */

const useColonyName = (address: Address) => {
  const dispatch = useDispatch();
  const fetchColonyName = useCallback(
    () => dispatch(fetchColonyNameActionCreator(address)),
    [address, dispatch],
  );
  const mapState = useCallback(
    state => ({
      colonyName: colonyNameSelector(state, { colonyAddress: address }),
    }),
    [address],
  );
  const { colonyName } = useMappedState(mapState);
  if (!colonyName) fetchColonyName();
  // we use split becuase we get the whole mycolony.colony.joincolony.eth
  return colonyName && colonyName.split('.')[0];
};

export default useColonyName;
