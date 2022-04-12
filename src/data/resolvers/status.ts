import { Resolvers } from '@apollo/client';

import { Context } from '~context/index';

import { getLatestSubgraphBlock } from './colony';
import { NETWORK_DATA, DEFAULT_NETWORK } from '~constants';

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

export const statusResolvers = ({
  colonyManager: { networkClient },
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
        const res = await fetch(
          `${reputationOracleEndpoint}/${networkNameForReputationOracle}`,
        );
        return res.status === 200;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});
