import {
  currentUserTokensSelector,
  userSelector,
  specificUsersSelector,
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
  select: specificUsersSelector,
  ttl: 60 * 1000,
});
