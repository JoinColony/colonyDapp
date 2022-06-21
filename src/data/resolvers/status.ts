import { Resolvers } from '@apollo/client';
import { ClientType, ROOT_DOMAIN_ID } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { Context } from '~context/index';

import { getLatestSubgraphBlock } from './colony';
import { NETWORK_DATA, DEFAULT_NETWORK } from '~constants';
import { PINATA_GATEWAY } from '~lib/pinata/constants';
import { isDev } from '~utils/debug';

const serverEndpoint = process.env.SERVER_ENDPOINT;

const reputationOracleEndpoint =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/reputation'
    : `${window.location.origin}/reputation`;

const networkNameForReputationOracle =
  process.env.NODE_ENV === 'development'
    ? 'local'
    : NETWORK_DATA[
        process.env.NETWORK || DEFAULT_NETWORK
      ].shortName.toLowerCase(); // NOTE: when adding new networks make sure this will work for it

const initialReputationRootHash =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export const statusResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  apolloClient,
}: Required<Context>): Resolvers => ({
  Query: {
    async latestRpcBlock() {
      try {
        const latestBlock = await networkClient.provider.getBlock('latest');
        return latestBlock.number.toString();
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async isServerAlive() {
      try {
        const res = await fetch(`${serverEndpoint}/liveness`);
        return res.status === 200;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async latestSubgraphBlock() {
      try {
        const latestSubgraphBlock = await getLatestSubgraphBlock(apolloClient);
        return latestSubgraphBlock.valueOf();
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async isReputationOracleAlive() {
      try {
        const latestRootHash = await networkClient.getReputationRootHash();

        if (
          latestRootHash === initialReputationRootHash &&
          (isDev || process.env.DEV)
        ) {
          return true;
        }

        const metaColonyAddress = await networkClient.getMetaColony();
        const colonyClient = await colonyManager.getClient(
          ClientType.ColonyClient,
          metaColonyAddress,
        );
        const { skillId } = await colonyClient.getDomain(ROOT_DOMAIN_ID);
        const res = await fetch(
          `${reputationOracleEndpoint}/${networkNameForReputationOracle}/${latestRootHash}/${metaColonyAddress}/${skillId}/${AddressZero}/noProof`,
        );
        return res.status === 200;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async isIPFSAlive() {
      try {
        if (!(isDev || process.env.DEV)) {
          // This specific hash is taken from https://ipfs.github.io/public-gateway-checker/
          const hashToCheck = `bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m`;
          const hashString = 'Hello from IPFS Gateway Checker';
          const res = await fetch(`${PINATA_GATEWAY}/${hashToCheck}`);
          const text = await res.text();
          return res.status === 200 && hashString === text.trim();
        }
        return true;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});
