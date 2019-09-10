import {
  currentUserTokensSelector,
  currentUserTransactionsSelector,
  userSelector,
  usersByAddressesSelector,
  inboxItemsSelector,
} from './selectors';
import {
  userFetch,
  userTokensFetch,
  userTokenTransfersFetch,
  inboxItemsFetch,
} from './actionCreators';

export const currentUserTokensFetcher = Object.freeze({
  fetch: userTokensFetch,
  select: currentUserTokensSelector,
  ttl: 60 * 1000,
});

export const currentUserTokenTransfersFetcher = Object.freeze({
  fetch: userTokenTransfersFetch,
  select: currentUserTransactionsSelector,
  ttl: 60 * 1000,
});

export const userFetcher = Object.freeze({
  fetch: userFetch,
  select: userSelector,
  ttl: 60 * 1000,
});

export const usersByAddressFetcher = Object.freeze({
  fetch: userFetch,
  select: usersByAddressesSelector,
  ttl: 60 * 1000,
});

export const inboxItemsFetcher = Object.freeze({
  fetch: inboxItemsFetch,
  select: inboxItemsSelector,
  ttl: 60 * 1000,
});
