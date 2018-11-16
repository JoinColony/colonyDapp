import merge from 'deepmerge';

import IPFSNode from '../../src/lib/ipfs';

const arrayMerge = (target, source) => source;

const createIPFSNode = async ipfsOptions => {
  const options = merge(
    IPFSNode.DEFAULT_OPTIONS,
    {
      ipfs: ipfsOptions,
    },
    { arrayMerge },
  );
  const node = new IPFSNode(options);
  await node.ready;
  return node;
};

export default createIPFSNode;
