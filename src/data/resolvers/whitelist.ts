import { ClientType } from '@colony/colony-js';
import { Resolvers } from '@apollo/client';
import { getNameValueFromMisc } from '@colony/colony-event-metadata-parser';

import { Context, ContextModule } from '~context/index';
import {
  getMinimalUser,
  SubgraphWhitelistEventsQuery,
  SubgraphWhitelistEventsQueryVariables,
  SubgraphWhitelistEventsDocument,
} from '~data/index';
import { log } from '~utils/debug';
import { parseSubgraphEvent } from '~utils/events';
import { getWhitelistPolicy } from '~utils/contracts';
import { WhitelistPolicy, Address } from '~types/index';

/*
 * This ensures that we can call the resolvers (which call whitelist
 * client contract methods) even when the extension is not initialized or is
 * deprecated
 *
 * Well, not call... call, but ensure that if it's not in a usable state, return
 * early and short circuit the resolver
 */
export const getWhitelistClientWithSafeties = async (
  colonyManager: Context[ContextModule.ColonyManager],
  colonyAddress: Address,
) => {
  try {
    const whitelistClient = await colonyManager?.getClient(
      ClientType.WhitelistClient,
      colonyAddress,
    );

    if (!whitelistClient) {
      return undefined;
    }

    let canUseExtension = false;
    try {
      await whitelistClient.isApproved(colonyAddress);
      canUseExtension = true;
    } catch (error) {
      // silent error
    }

    whitelistClient.canUseExtension = canUseExtension;
    return whitelistClient;
  } catch (error) {
    // silent error
    return undefined;
  }
};

export const whitelistResolvers = ({
  colonyManager,
  ipfsWithFallback,
  apolloClient,
}: Required<Context>): Resolvers => ({
  Query: {
    async whitelistAgreement(_, { agreementHash }) {
      try {
        const response = await ipfsWithFallback.getString(agreementHash);

        return getNameValueFromMisc('agreement', response);
      } catch (error) {
        log.verbose(
          `Could not fetch whitelist agreement from IPFS with hash: `,
          agreementHash,
        );
        return null;
      }
    },
    async whitelistPolicies(_, { colonyAddress }) {
      try {
        const whitelistClient = await getWhitelistClientWithSafeties(
          colonyManager,
          colonyAddress,
        );

        if (whitelistClient?.canUseExtension) {
          const agreementHash = await whitelistClient.getAgreementHash();
          const useApprovals = await whitelistClient.getUseApprovals();

          return {
            useApprovals,
            agreementHash,
            policyType: getWhitelistPolicy(useApprovals, !!agreementHash),
          };
        }
        return {
          useApprovals: null,
          agreementHash: null,
          policyType: null,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async userWhitelistStatus(_, { colonyAddress, userAddress }) {
      try {
        const whitelistClient = await getWhitelistClientWithSafeties(
          colonyManager,
          colonyAddress,
        );

        if (whitelistClient?.canUseExtension) {
          const userIsWhitelisted = await whitelistClient.isApproved(
            userAddress,
          );
          const userSignedAgreement = await whitelistClient.getSignature(
            userAddress,
          );
          const userIsApproved = await whitelistClient.getApproval(userAddress);

          return {
            userIsWhitelisted,
            userSignedAgreement,
            userIsApproved,
          };
        }
        return {
          userIsWhitelisted: null,
          userSignedAgreement: null,
          userIsApproved: null,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async whitelistedUsers(_, { colonyAddress }) {
      try {
        const whitelistClient = await getWhitelistClientWithSafeties(
          colonyManager,
          colonyAddress,
        );

        if (!whitelistClient?.canUseExtension) {
          return [];
        }

        const whitelistUsesKYC = await whitelistClient.getUseApprovals();
        const whitelistUsesAgreement = await whitelistClient.getAgreementHash();

        const policyType = getWhitelistPolicy(
          whitelistUsesKYC,
          !!whitelistUsesAgreement,
        );

        const { data } = await apolloClient.query<
          SubgraphWhitelistEventsQuery,
          SubgraphWhitelistEventsQueryVariables
        >({
          query: SubgraphWhitelistEventsDocument,
          variables: {
            extensionAddress: whitelistClient.address.toLowerCase(),
          },
          fetchPolicy: 'network-only',
        });

        const userApprovedEvents = (data?.userApprovedEvents || []).map(
          parseSubgraphEvent,
        );
        const agreementSignedEvents = (data?.agreementSignedEvents || []).map(
          parseSubgraphEvent,
        );

        const kycUsers = {};
        userApprovedEvents.map(
          ({ values: { _user: walletAddress, _status: approvedStatus } }) => {
            kycUsers[walletAddress] = kycUsers[walletAddress]
              ? { ...kycUsers[walletAddress], approved: approvedStatus }
              : { ...getMinimalUser(walletAddress), approved: approvedStatus };
            return walletAddress;
          },
        );

        /*
         * Policy is KYC
         */
        if (policyType === WhitelistPolicy.KycOnly) {
          return Object.keys(kycUsers)
            .map((walletAddress) => kycUsers[walletAddress])
            .filter(({ approved }) => approved);
        }

        const signedUsers = {};
        agreementSignedEvents.map(({ values: { _user: walletAddress } }) => {
          signedUsers[walletAddress] = signedUsers[walletAddress]
            ? signedUsers[walletAddress]
            : { ...getMinimalUser(walletAddress) };
          return walletAddress;
        });

        /*
         * Policy is Agreement
         */
        if (policyType === WhitelistPolicy.AgreementOnly) {
          return Object.keys(signedUsers).map(
            (walletAddress) => signedUsers[walletAddress],
          );
        }

        /*
         * Policy is both KYC and Agreement
         */
        const kycAndSignedUsers = { ...kycUsers };
        Object.keys(signedUsers).map((walletAddress) => {
          kycAndSignedUsers[walletAddress] = kycAndSignedUsers[walletAddress]
            ? { ...kycAndSignedUsers[walletAddress], agreementSigned: true }
            : {
                ...signedUsers[walletAddress],
                approved: false,
                agreementSigned: true,
              };
          return walletAddress;
        });

        return Object.keys(kycAndSignedUsers).map(
          (walletAddress) => kycAndSignedUsers[walletAddress],
        );
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
});
