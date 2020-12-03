import { ipfsDataSelector } from './selectors';
import { fetchIpfsData } from './actionCreators';

export const ipfsDataFetcher = Object.freeze({
  select: ipfsDataSelector,
  fetch: fetchIpfsData,
  ttl: Infinity, // IPFS hashes should not expire
});
