import pinataClient from './pinataClient';
import ipfsNode from './ipfsNodeContext';

import getIPFSWithFallback from './getIPFSWithFallback';

const ipfsWithFallback = getIPFSWithFallback(ipfsNode, pinataClient);

export default ipfsWithFallback;
