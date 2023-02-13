import { ClientType, ColonyClientV6 } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';
import { Resolvers } from '@apollo/client';

import { createAddress } from '~utils/web3';
import { log } from '~utils/debug';
import { parseSubgraphEvent } from '~utils/events';
import {
  RecoveryAllEnteredEventsQuery,
  RecoveryAllEnteredEventsQueryVariables,
  RecoveryAllEnteredEventsDocument,
  RecoveryRolesAndApprovalsForSessionQuery,
  RecoveryRolesAndApprovalsForSessionQueryVariables,
  RecoveryRolesAndApprovalsForSessionDocument,
  ParsedEvent,
  SubgraphAnnotationEventsQuery,
  SubgraphAnnotationEventsQueryVariables,
  SubgraphAnnotationEventsDocument,
} from '~data/index';
import { Context } from '~context/index';
import { ColonyAndExtensionsEvents } from '~types/index';

import { getLatestSubgraphBlock } from './colony';

export const eventsResolvers = ({
  colonyManager,
  apolloClient,
}: Required<Context>): Resolvers => ({
  Query: {
    /*
     * @TODO This needs to be made more generalized, and less recovery-mode specific
     * once we have to replicate this logic for Motions and Disputes
     */
    async actionsThatNeedAttention(_, { colonyAddress, walletAddress }) {
      try {
        const currentBlock = await getLatestSubgraphBlock(apolloClient);
        /*
         * @NOTE Leveraging apollo's internal cache
         *
         * This might seem counter intuitive, fetching an apollo query here,
         * when we could just parse the logs and events directly, but
         * doing so, allows us to fetch the recovery events that are already
         * inside the cache, and not be forced to fetch them all over again.
         *
         * This cuts down on loading times, especially on pages with a lot
         * of events generated.
         */
        const recoveryStartedEvents = await apolloClient.query<
          RecoveryAllEnteredEventsQuery,
          RecoveryAllEnteredEventsQueryVariables
        >({
          query: RecoveryAllEnteredEventsDocument,
          variables: {
            colonyAddress,
            currentBlock,
          },
          fetchPolicy: 'network-only',
        });

        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;

        const colonyInRecoveryMode = await colonyClient.isInRecoveryMode();
        const enterRecoveryEvents =
          recoveryStartedEvents?.data?.recoveryAllEnteredEvents || [];

        const [mostRecentRecoveryStarted] = [...enterRecoveryEvents].reverse();

        const recoveryApprovalsForCurrentSession = await apolloClient.query<
          RecoveryRolesAndApprovalsForSessionQuery,
          RecoveryRolesAndApprovalsForSessionQueryVariables
        >({
          query: RecoveryRolesAndApprovalsForSessionDocument,
          variables: {
            colonyAddress,
            blockNumber: mostRecentRecoveryStarted?.blockNumber || currentBlock,
          },
        });

        if (
          !recoveryStartedEvents?.data?.recoveryAllEnteredEvents?.length ||
          !recoveryApprovalsForCurrentSession?.data
            ?.recoveryRolesAndApprovalsForSession?.length ||
          !colonyInRecoveryMode
        ) {
          return [];
        }

        /*
         * If we made it so far, we're in recovery mode
         */
        const {
          recoveryRolesAndApprovalsForSession: approvalsForSession,
        } = recoveryApprovalsForCurrentSession.data;

        const currentUserNeedsToApprove = approvalsForSession.find(
          ({ id: userWalletAddress, approvedRecoveryExit }) =>
            !approvedRecoveryExit &&
            userWalletAddress.toLowerCase() === walletAddress.toLowerCase(),
        );

        if (currentUserNeedsToApprove) {
          const { recoveryAllEnteredEvents } = recoveryStartedEvents.data;
          const recoveryActions = [...recoveryAllEnteredEvents];
          const mostRecentRecoveryAction =
            recoveryActions[recoveryActions.length - 1];
          if (mostRecentRecoveryAction) {
            recoveryActions[recoveryActions.length - 1] = {
              ...mostRecentRecoveryAction,
              needsAction: true,
            } as ParsedEvent & { needsAction: boolean };
            const actionsThatNeedAttention = (recoveryActions as Array<
              ParsedEvent & { needsAction: boolean }
            >).map(({ transactionHash, needsAction }) => ({
              transactionHash,
              needsAction: !!needsAction,
            }));
            /*
             * Only return the actions that actually need attention, otherwise
             * return a empty array
             *
             * By doing so, we lighted the processing need of the actions list
             * transformer
             */
            return actionsThatNeedAttention.filter(
              ({ needsAction }) => needsAction,
            );
          }
        }
        return [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
  Event: {
    async processedValues({
      args,
      name,
      transaction,
      associatedColony: { colonyAddress = AddressZero },
    }) {
      try {
        const initialValues = JSON.parse(args);
        if (
          name.includes(
            ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots,
          )
        ) {
          const colonyClient = await colonyManager.getClient(
            ClientType.ColonyClient,
            createAddress(colonyAddress),
          );
          const fromDomain = await colonyClient.getDomainFromFundingPot(
            initialValues.fromPot,
          );
          const toDomain = await colonyClient.getDomainFromFundingPot(
            initialValues.toPot,
          );
          initialValues.fromDomain = fromDomain.toString();
          initialValues.toDomain = toDomain.toString();
        } else if (
          name.includes(ColonyAndExtensionsEvents.ArbitraryTransaction)
        ) {
          const { data: subgraphEvents } = await apolloClient.query<
            SubgraphAnnotationEventsQuery,
            SubgraphAnnotationEventsQueryVariables
          >({
            query: SubgraphAnnotationEventsDocument,
            variables: {
              transactionHash: transaction.hash,
              sortDirection: 'desc',
            },
            fetchPolicy: 'network-only',
          });
          const [safeTransactionsAnnotation] = (
            subgraphEvents?.annotationEvents || []
          ).map(parseSubgraphEvent);
          if (safeTransactionsAnnotation) {
            initialValues.metadata =
              safeTransactionsAnnotation.values?.metadata;
            initialValues.agent = safeTransactionsAnnotation.values.agent;
          }
        }

        return initialValues;
      } catch (error) {
        log.verbose(`Could not get the event args from: ${args}`);
        log.verbose(error);
        return {};
      }
    },
  },
});
