import IPFS from 'ipfs';
import IPFSNode from '../lib/ipfs';

const config = IPFSNode.getIpfsConfig();
const ipfs = new IPFS(config);

const ipfsNode = new IPFSNode(ipfs);

export default ipfsNode;
