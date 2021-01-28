import IPFSNode from '~lib/ipfs';
import Pinata from '~lib/pinata';

import { raceAgainstTimeout } from '~utils/async';

const DEFAULT_TIMEOUT = 10000;

const getIPFSWithFallback = (ipfsNode: IPFSNode, pinataClient: Pinata) => {
  const ipfsWithTimeout = {
    getString: async (hash) =>
      raceAgainstTimeout(
        ipfsNode.getString(hash),
        DEFAULT_TIMEOUT,
        new Error('Timeout reached trying to get data from IPFS'),
      ),
    addString: async (data) =>
      raceAgainstTimeout(
        ipfsNode.addString(data),
        DEFAULT_TIMEOUT,
        new Error('Timeout reached trying to upload data to IPFS'),
      ),
  };
  const pinataWithTimeout = {
    getString: async (hash) =>
      raceAgainstTimeout(
        pinataClient.getJSON(hash),
        DEFAULT_TIMEOUT,
        new Error('Timeout reached trying to get data from IPFS via Pinata'),
      ),
    addString: async (data) =>
      raceAgainstTimeout(
        pinataClient.addJSON(data),
        DEFAULT_TIMEOUT,
        new Error('Timeout reached trying to upload data to IPFS via Pinata'),
      ),
  };
  if (process.env.NODE_ENV === 'development') {
    return ipfsWithTimeout;
  }
  if (!(process.env.PINATA_API_KEY && process.env.PINATA_API_SECRET)) {
    return ipfsWithTimeout;
  }
  return pinataWithTimeout;
};

export default getIPFSWithFallback;
