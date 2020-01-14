import { useEffect, useState } from 'react';

import { Address } from '~types/strings';
import { ActionTypes } from '~redux/index';
import { useAsyncFunction } from '~utils/hooks';

export const useUserAddressFetcher = (
  username: string | null,
): { userAddress: Address | void; error: Error | null } => {
  const [userAddress, setUserAddress] = useState(undefined);
  const [error, setError] = useState();
  const userAddressFetch = useAsyncFunction({
    error: ActionTypes.USER_ADDRESS_FETCH_ERROR,
    submit: ActionTypes.USER_ADDRESS_FETCH,
    success: ActionTypes.USER_ADDRESS_FETCH_SUCCESS,
  });
  useEffect(() => {
    userAddressFetch({ username })
      .then((payload: any) => {
        setUserAddress(payload.userAddress);
      })
      .catch(setError);
  }, [userAddressFetch, username]);
  return { userAddress, error };
};
