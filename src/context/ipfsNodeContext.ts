import IPFS from 'ipfs';
import IPFSNode from '../lib/ipfs';

import { log } from '../utils/debug';

const config = IPFSNode.getIpfsConfig();
const ipfs = new IPFS(config);

const ipfsNode = new IPFSNode(ipfs);
ipfsNode.connectPinner().catch(log.error);

export default ipfsNode;
