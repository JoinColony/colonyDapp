import { ClientType } from '@colony/colony-js';
import { Resolvers } from '@apollo/client';

import { Context } from '~context/index';

import { log } from '~utils/debug';

export const whitelistResolvers = ({
  colonyManager,
  ipfsWithFallback,
}: Required<Context>): Resolvers => ({
  Query: {
    async whitelistAgreement(_, { agreementHash }) {
      try {
        const agreement = await ipfsWithFallback.getString(agreementHash);

        return JSON.parse(agreement).agreement;
      } catch (error) {
        log.verbose(
          `Could not fetch whitelist agreement from IPFS with hash: `,
          agreementHash,
        );
        return null;
      }
    },
    async whitelistAgreementHash(_, { colonyAddress }) {
      try {
        const whitelistClient = await colonyManager.getClient(
          ClientType.WhitelistClient,
          colonyAddress,
        );

        const agreementHash = await whitelistClient.getAgreementHash();

        return agreementHash || null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async whitelistPolicy(_, { colonyAddress, userAddress }) {
      try {
        const whitelistClient = await colonyManager.getClient(
          ClientType.WhitelistClient,
          colonyAddress,
        );

        const agreementHash = await whitelistClient.getAgreementHash();
        const useApprovals = await whitelistClient.getUseApprovals();
        const userIsApproved = await whitelistClient.isApproved(userAddress);

        return {
          userIsApproved,
          kycRequired: useApprovals,
          agreementRequired: !!agreementHash,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});
