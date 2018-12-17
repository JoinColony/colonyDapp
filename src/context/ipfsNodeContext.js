/* @flow */

import IPFSNode from '../lib/ipfs';

const ipfsNode = new IPFSNode();
ipfsNode.connectPinner();

export default ipfsNode;
