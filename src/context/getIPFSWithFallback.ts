import IPFSNode from '~lib/ipfs';
import Pinata from '~lib/pinata';

import { raceAgainstTimeout } from '~utils/async';

const DEFAULT_TIMEOUT_GET = 10000;
const DEFAULT_TIMEOUT_POST = 30000;

const getIPFSWithFallback = (ipfsNode?: IPFSNode, pinataClient?: Pinata) => {
  let ipfsWithTimeout;
  if (ipfsNode) {
    ipfsWithTimeout = {
      getString: async (hash) =>
        raceAgainstTimeout(
          ipfsNode.getString(hash),
          DEFAULT_TIMEOUT_GET,
          new Error('Timeout reached trying to get data from IPFS'),
        ),
      addString: async (data) =>
        raceAgainstTimeout(
          ipfsNode.addString(data),
          DEFAULT_TIMEOUT_POST,
          new Error('Timeout reached trying to upload data to IPFS'),
        ),
    };
  }
  let pinataWithTimeout;
  if (pinataClient) {
    pinataWithTimeout = {
      getString: async (hash) =>
        raceAgainstTimeout(
          pinataClient.getJSON(hash),
          DEFAULT_TIMEOUT_GET,
          new Error('Timeout reached trying to get data from IPFS via Pinata'),
        ),
      addString: async (data) =>
        raceAgainstTimeout(
          pinataClient.addJSON(data),
          DEFAULT_TIMEOUT_POST,
          new Error('Timeout reached trying to upload data to IPFS via Pinata'),
        ),
    };
  }
  if (ipfsWithTimeout) {
    return ipfsWithTimeout;
  }
  if (pinataWithTimeout) {
    return pinataWithTimeout;
  }
  return null;
};

export default getIPFSWithFallback;
