// eslint-disable-next-line import/no-extraneous-dependencies
import { promisify } from 'util';
// eslint-disable-next-line import/no-extraneous-dependencies
import { create as createIPFS } from 'ipfsd-ctl';
import IPFSNode from '../../src/lib/ipfs';

const createIPFSNode = async ipfsConfig => {
  const client = createIPFS({ type: 'js' });
  const ipfsd = await promisify(client.spawn.bind(client))({
    config: ipfsConfig,
    start: false,
  });
  await promisify(ipfsd.start.bind(ipfsd))(['--enable-pubsub-experiment']);
  const ipfs = ipfsd.api;
  // Fix for IPFS API
  ipfs.isOnline = () => true;
  const node = new IPFSNode(ipfs);
  await node.ready;
  await node.connectPinner();
  return node;
};

export default createIPFSNode;
