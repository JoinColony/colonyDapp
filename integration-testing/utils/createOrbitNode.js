import merge from 'deepmerge';
import OrbitDB from 'orbit-db';
import Keystore from 'orbit-db-keystore';

const keystore = Keystore.create();

const { IdentityProvider } = OrbitDB;

const createOrbitNode = async (ipfs, name, options) => {
  await ipfs.ready;
  const config = merge({ path: 'colonyOrbitdb' }, options);
  const identity = await IdentityProvider.createIdentity(keystore, name);
  return new OrbitDB(ipfs, identity, config);
};

export default createOrbitNode;
