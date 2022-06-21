import IPFSNode from '../lib/ipfs';

import pinataClient from './pinataClient';
import getIPFSWithFallback from './getIPFSWithFallback';

const getIPFSContext = () => {
  if (
    process.env.NODE_ENV === 'development' ||
    !(process.env.PINATA_API_KEY && process.env.PINATA_API_SECRET)
  ) {
    const ipfsNode = new IPFSNode();
    return getIPFSWithFallback(ipfsNode);
  }
  return getIPFSWithFallback(undefined, pinataClient);
};

const ipfsWithFallback = getIPFSContext();

export default ipfsWithFallback;
