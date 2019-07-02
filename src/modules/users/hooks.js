/* @flow */

// $FlowFixMe
import { useEffect, useState } from 'react';

import type { Address } from '~types/strings';

import { ACTIONS } from '~redux';
import { useAsyncFunction } from '~utils/hooks';

// eslint-disable-next-line import/prefer-default-export
export const useUserAddressFetcher = (
  username: ?string,
): {| userAddress: Address | void, error: ?Error |} => {
  const [userAddress, setUserAddress] = useState(undefined);
  const [error, setError] = useState();
  const userAddressFetch = useAsyncFunction({
    error: ACTIONS.USER_ADDRESS_FETCH_ERROR,
    submit: ACTIONS.USER_ADDRESS_FETCH,
    success: ACTIONS.USER_ADDRESS_FETCH_SUCCESS,
  });
  useEffect(
    () => {
      userAddressFetch({ username })
        .then(payload => {
          setUserAddress(payload.userAddress);
        })
        .catch(setError);
    },
    [userAddressFetch, username],
  );
  return { userAddress, error };
};
