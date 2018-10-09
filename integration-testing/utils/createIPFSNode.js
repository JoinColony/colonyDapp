import merge from 'deepmerge';

import IPFSNode from '../../src/lib/ipfsNode/IPFSNode';

const createIPFSNode = async ipfsOptions => {
  const options = merge(IPFSNode.DEFAULT_OPTIONS, {
    ipfs: ipfsOptions,
  });
  const node = new IPFSNode(options);
  await node.ready;
  return node;
};

export default createIPFSNode;
