import {
  currentUserTokensSelector,
  usersByAddressesSelector,
} from './selectors';
import { userFetch, userTokensFetch } from './actionCreators';

export const currentUserTokensFetcher = Object.freeze({
  fetch: userTokensFetch,
  select: currentUserTokensSelector,
  ttl: 60 * 1000,
});

export const usersByAddressFetcher = Object.freeze({
  fetch: userFetch,
  select: usersByAddressesSelector,
  ttl: 60 * 1000,
});
