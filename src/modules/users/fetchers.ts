import {
  currentUserTokensSelector,
  usersByAddressesSelector,
  userSelector,
} from './selectors';
import { userFetch, userTokensFetch } from './actionCreators';

export const currentUserTokensFetcher = Object.freeze({
  fetch: userTokensFetch,
  select: currentUserTokensSelector,
  ttl: 60 * 1000,
});

export const userFetcher = Object.freeze({
  fetch: userFetch,
  select: userSelector,
  ttl: 60 * 1000,
});

export const userMapFetcher = Object.freeze({
  fetch: userFetch,
  select: usersByAddressesSelector,
  ttl: 60 * 1000,
});
