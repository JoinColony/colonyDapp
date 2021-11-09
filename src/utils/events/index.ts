import {
  ColonyClient,
  ClientType,
  ExtensionClient,
  MotionState as NetworkMotionState,
  getEvents,
} from '@colony/colony-js';
import { bigNumberify, BigNumberish, hexStripZeros } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';

import ColonyManagerClass from '~lib/ColonyManager';
import {
  ColonyActions,
  ColonyMotions,
  motionNameMapping,
  ColonyAndExtensionsEvents,
  Address,
  FormattedAction,
  ActionUserRoles,
} from '~types/index';
import { ParsedEvent } from '~data/index';
import { ProcessedEvent } from '~data/resolvers/colonyActions';

import {
  ACTIONS_EVENTS,
  EVENTS_REQUIRED_FOR_ACTION,
} from '~dashboard/ActionsPage';
import ipfs from '~context/ipfsWithFallbackContext';
import { log } from '~utils/debug';

import { getMotionRequiredStake, MotionState } from '../colonyMotions';
import { availableRoles } from '~dashboard/PermissionManagementDialog';

interface ActionValues {
  recipient: Address;
  amount: string;
  tokenAddress: Address;
  fromDomain: number;
  toDomain: number;
  oldVersion: string;
  newVersion: string;
  address: Address;
  roles: ActionUserRoles[];
  reputationChange: BigNumberish;
}

interface MotionValues extends ActionValues {
  motionNAYStake: string;
  motionState: MotionState;
  actionInitiator: string;
  motionDomain: number;
  rootHash: string;
  domainName: string | null;
  domainColor: number | null;
  domainPurpose: string | null;
}

export * from './subgraphEvents';
export * from './getAnnotationFromSubgraph';

/*
 * @TODO Helpers in here need to be refactored so bad...
 * Hope we can get a break at some point and tackle this type of stuff
 */

/*
 * Main logic for detecting a action type based on an array of "required" events
 */
export const getActionType = (
  processedEvents: ProcessedEvent[],
): ColonyActions => {
  const potentialActions = {};
  Object.values(EVENTS_REQUIRED_FOR_ACTION).map(
    (eventsWithPositions, index) => {
      /*
       * Filter the events by just the "required" ones
       */
      const filteredParsedEvents = processedEvents.filter(({ name }) =>
        eventsWithPositions?.includes(name),
      );
      /*
       * Add to the potential actions object, both the key
       * and the reduced truthy/falsy value
       */
      potentialActions[
        Object.keys(EVENTS_REQUIRED_FOR_ACTION)[index]
      ] = eventsWithPositions
        ?.map((eventName, eventIndex) => {
          /*
           * Check the existance of the event
           */
          if (filteredParsedEvents[eventIndex]) {
            /*
             * Check the correct position in the events chain
             */
            const isEventInPosition =
              filteredParsedEvents[eventIndex].name === eventName;

            /*
             *  Check if the event is a reputation change
             *  Then check if the change is a reward or penalty
             */
            if (
              filteredParsedEvents[eventIndex].name ===
              ColonyAndExtensionsEvents.ArbitraryReputationUpdate
            ) {
              const isReputationChangePositive = bigNumberify(
                filteredParsedEvents[eventIndex].values.amount,
              ).gt(0);
              if (
                Object.keys(EVENTS_REQUIRED_FOR_ACTION)[index] ===
                ColonyActions.EmitDomainReputationReward
              ) {
                return isEventInPosition && isReputationChangePositive;
              }
              if (
                Object.keys(EVENTS_REQUIRED_FOR_ACTION)[index] ===
                ColonyActions.EmitDomainReputationPenalty
              ) {
                return isEventInPosition && !isReputationChangePositive;
              }
            }

            return isEventInPosition;
          }
          return false;
        })
        /*
         * Reduce the array of boleans to a single value
         */
        .every((event) => !!event);
      return null;
    },
  );
  /*
   * Check if we have a possible action (the first object key that is true)
   */
  const [potentialAction] = Object.keys(potentialActions).filter(
    (actionName) => potentialActions[actionName],
  );
  return (potentialAction as ColonyActions) || ColonyActions.Generic;
};

export const getAllAvailableClients = async (
  colonyAddress?: Address,
  colonyManager?: ColonyManagerClass,
) => {
  if (colonyAddress && colonyManager) {
    return (
      await Promise.all(
        Object.values(ClientType).map(async (clientType) => {
          try {
            return await colonyManager.getClient(clientType, colonyAddress);
          } catch (error) {
            return undefined;
          }
        }),
      )
    ).filter((clientType) => !!clientType);
  }
  return [];
};

/*
 * Get the events to list on the action's page, based on a map
 */
export const getEventsForActions = (
  events: ParsedEvent[],
  actionType: ColonyActions | ColonyMotions,
): ParsedEvent[] => [
  ...((ACTIONS_EVENTS[actionType] as ColonyAndExtensionsEvents[]) || [])
    ?.map((event) => events.filter(({ name }) => name === event))
    .flat(),
];

export const formatEventName = (
  rawEventName: string,
): ColonyAndExtensionsEvents =>
  rawEventName.split('(')[0] as ColonyAndExtensionsEvents;

const getPaymentActionValues = async (
  processedEvents: ProcessedEvent[],
  colonyClient: ColonyClient,
): Promise<Partial<ActionValues>> => {
  /*
   * Get the additional events to fetch values from
   *
   * We don't have to worry about these events existing, as long as this
   * is an action event, these events will exist
   */
  const oneTxPaymentEvent = processedEvents.find(
    ({ name }) => name === ColonyAndExtensionsEvents.OneTxPaymentMade,
  ) as ProcessedEvent;
  const paymentAddedEvent = processedEvents.find(
    ({ name }) => name === ColonyAndExtensionsEvents.PaymentAdded,
  ) as ProcessedEvent;
  const payoutClaimedEvent = processedEvents.find(
    ({ name }) => name === ColonyAndExtensionsEvents.PayoutClaimed,
  ) as ProcessedEvent;

  /*
   * Get the payment details from the payment id
   */
  const {
    values: { paymentId },
  } = paymentAddedEvent;
  /*
   * Fetch the rest of the values that are present directly in the events
   */
  const {
    values: { amount: paymentAmount, token },
  } = payoutClaimedEvent;
  /*
   * Get the agent value
   */
  const {
    address,
    values: { agent },
  } = oneTxPaymentEvent;

  const paymentDetails = await colonyClient.getPayment(paymentId);
  const fromDomain = bigNumberify(paymentDetails.domainId || 1).toNumber();
  const recipient = paymentDetails.recipient || AddressZero;
  const paymentActionValues: {
    amount: string;
    tokenAddress: Address;
    fromDomain: number;
    recipient: Address;
    actionInitiator?: string;
    address: Address;
  } = {
    amount: bigNumberify(paymentAmount || '0').toString(),
    tokenAddress: token || AddressZero,
    fromDomain,
    recipient,
    address,
  };
  if (agent) {
    paymentActionValues.actionInitiator = agent;
  }
  return paymentActionValues;
};

const getDomainValuesFromIPFS = async (ipfsHash: string) => {
  let ipfsMetadata: any = null;
  let domainName = null;
  let domainColor = null;
  let domainPurpose = null;

  try {
    ipfsMetadata = await ipfs.getString(ipfsHash);
  } catch (error) {
    log.verbose(
      'Could not fetch IPFS metadata for domain with hash:',
      ipfsHash,
    );
  }

  try {
    if (ipfsMetadata) {
      const domainMetadata = JSON.parse(ipfsMetadata);

      domainName = domainMetadata.domainName;
      domainColor = domainMetadata.domainColor || null;
      domainPurpose = domainMetadata.domainPurpose || null;
    }
  } catch (error) {
    log.verbose(
      `Could not parse IPFS metadata for domain, using hash:`,
      ipfsHash,
      'with object:',
      ipfsMetadata,
    );
  }

  const domainValues: {
    domainName: string | null;
    domainColor: number | null;
    domainPurpose: string | null;
  } = {
    domainName,
    domainColor,
    domainPurpose,
  };

  return domainValues;
};

const getMoveFundsActionValues = async (
  processedEvents: ProcessedEvent[],
  colonyClient: ColonyClient,
): Promise<Partial<ActionValues>> => {
  /*
   * Get the move funds event to fetch values from
   *
   * We don't have to worry about the event existing, as long as this
   * is an move funds event, these events will exist
   */
  const moveFundsEvent = processedEvents.find(
    ({ name }) =>
      name === ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots,
  ) as ProcessedEvent;

  /*
   * Fetch the rest of the values that are present directly in the event
   */
  const {
    address,
    values: { amount, fromPot, toPot, token, agent },
  } = moveFundsEvent;

  /*
   * Fetch the domain ids from their respective pot ids
   */
  const fromDomain = await colonyClient.getDomainFromFundingPot(fromPot);
  const toDomain = await colonyClient.getDomainFromFundingPot(toPot);

  const moveFundsActionValues: {
    amount: string;
    tokenAddress: Address;
    fromDomain: number;
    toDomain: number;
    actionInitiator?: string;
    address: Address;
  } = {
    amount: bigNumberify(amount || '0').toString(),
    tokenAddress: token || AddressZero,
    fromDomain: bigNumberify(fromDomain || '1').toNumber(),
    toDomain: bigNumberify(toDomain || '1').toNumber(),
    address,
  };
  if (agent) {
    moveFundsActionValues.actionInitiator = agent;
  }
  return moveFundsActionValues;
};

const getMintTokensActionValues = async (
  processedEvents: ProcessedEvent[],
  colonyClient: ColonyClient,
): Promise<Partial<ActionValues>> => {
  const mintTokensEvent = processedEvents.find(
    ({ name }) => name === ColonyAndExtensionsEvents.TokensMinted,
  ) as ProcessedEvent;

  const tokenAddress = await colonyClient.getToken();

  const {
    address,
    values: { who, amount, agent },
  } = mintTokensEvent;

  const tokensMintedValues: {
    amount: string;
    tokenAddress: Address;
    actionInitiator?: string;
    recipient: Address;
    address: Address;
  } = {
    amount: bigNumberify(amount || '0').toString(),
    recipient: who,
    tokenAddress,
    address,
  };
  if (agent) {
    tokensMintedValues.actionInitiator = agent;
  }
  return tokensMintedValues;
};

const getCreateDomainActionValues = async (
  processedEvents: ProcessedEvent[],
): Promise<Partial<ActionValues>> => {
  const domainAddedEvent = processedEvents.find(
    ({ name }) => name === ColonyAndExtensionsEvents.DomainAdded,
  ) as ProcessedEvent;

  const {
    address,
    values: { agent },
  } = domainAddedEvent;

  const domainAction: {
    address: Address;
    fromDomain: number;
    actionInitiator?: string;
  } = {
    address,
    fromDomain: parseInt(domainAddedEvent.values.domainId.toString(), 10),
  };
  if (agent) {
    domainAction.actionInitiator = agent;
  }
  return domainAction;
};

const getVersionUpgradeActionValues = async (
  processedEvents: ProcessedEvent[],
): Promise<Partial<ActionValues>> => {
  const versionUpgradeEvent = processedEvents.find(
    ({ name }) => name === ColonyAndExtensionsEvents.ColonyUpgraded,
  ) as ProcessedEvent;

  const {
    address,
    values: { oldVersion, newVersion, agent },
  } = versionUpgradeEvent;

  const colonyContractUpgradeValues: {
    address: Address;
    actionInitiator?: string;
    oldVersion: string;
    newVersion: string;
  } = {
    address,
    oldVersion: bigNumberify(oldVersion || '0').toString(),
    newVersion: bigNumberify(newVersion || '0').toString(),
  };

  if (agent) {
    colonyContractUpgradeValues.actionInitiator = agent;
  }
  return colonyContractUpgradeValues;
};

const getColonyEditActionValues = async (
  processedEvents: ProcessedEvent[],
): Promise<Partial<ActionValues>> => {
  let colonyDisplayName = null;
  let colonyAvatarHash = null;
  let colonyTokens = [];

  const colonyMetadataEvent = processedEvents.find(
    ({ name }) => name === ColonyAndExtensionsEvents.ColonyMetadata,
  ) as ProcessedEvent;

  const {
    address,
    values: { agent, metadata },
  } = colonyMetadataEvent;

  /*
   * Fetch the colony's metadata
   */
  let ipfsMetadata: any = null;
  try {
    ipfsMetadata = await ipfs.getString(metadata);
  } catch (error) {
    log.verbose(
      'Could not fetch IPFS metadata for colony with hash:',
      metadata,
    );
  }

  try {
    if (ipfsMetadata) {
      const {
        colonyDisplayName: displayName,
        colonyAvatarHash: avatarHash,
        colonyTokens: tokenAddresses,
      } = JSON.parse(ipfsMetadata);

      colonyDisplayName = displayName;
      colonyAvatarHash = avatarHash;
      colonyTokens = tokenAddresses;
    }
  } catch (error) {
    log.verbose(
      `Could not parse IPFS metadata for colony, using hash:`,
      metadata,
      'with object:',
      ipfsMetadata,
    );
  }

  const colonyEditValues: {
    address: Address;
    actionInitiator?: string;
    colonyDisplayName: string | null;
    colonyAvatarHash?: string | null;
    colonyTokens?: string[];
  } = {
    address,
    colonyDisplayName,
    colonyAvatarHash,
    colonyTokens,
  };

  if (agent) {
    colonyEditValues.actionInitiator = agent;
  }
  return colonyEditValues;
};

const getEditDomainActionValues = async (
  processedEvents: ProcessedEvent[],
): Promise<Partial<ActionValues>> => {
  const domainMetadataEvent = processedEvents.find(
    ({ name }) => name === ColonyAndExtensionsEvents.DomainMetadata,
  ) as ProcessedEvent;

  const {
    address,
    values: { agent, domainId, metadata },
  } = domainMetadataEvent;

  const domainValues = await getDomainValuesFromIPFS(metadata);

  const domainMetadataValues: {
    address: Address;
    fromDomain: number;
    actionInitiator?: string;
    domainName: string | null;
    domainColor: number | null;
    domainPurpose: string | null;
  } = {
    ...domainValues,
    address,
    fromDomain: parseInt(domainId.toString(), 10),
  };
  if (agent) {
    domainMetadataValues.actionInitiator = agent;
  }
  return domainMetadataValues;
};

const getSetUserRolesActionValues = async (
  processedEvents: ProcessedEvent[],
): Promise<Partial<ActionValues>> => {
  const setUserRolesEvents = processedEvents.filter(
    ({ name }) => name === ColonyAndExtensionsEvents.ColonyRoleSet,
  ) as ProcessedEvent[];

  const roles: ActionUserRoles[] = setUserRolesEvents.map(({ values }) => ({
    id: values.role,
    setTo: values.setTo,
  }));

  const {
    address,
    values: { agent, user, domainId },
  } = setUserRolesEvents[0];

  const userRoleAction: {
    address: Address;
    recipient: Address;
    roles: ActionUserRoles[];
    fromDomain: number;
    actionInitiator?: string;
  } = {
    address,
    recipient: user,
    roles,
    fromDomain: parseInt(domainId.toString(), 10),
  };

  if (agent) {
    userRoleAction.actionInitiator = agent;
  }

  return userRoleAction;
};

const getRecoveryActionValues = async (
  processedEvents: ProcessedEvent[],
): Promise<Partial<ActionValues>> => {
  const recoveryModeEntered = processedEvents.find(
    ({ name }) => name === ColonyAndExtensionsEvents.RecoveryModeEntered,
  ) as ProcessedEvent;

  const {
    address,
    values: { user },
  } = recoveryModeEntered;

  const recoveryAction: {
    address: Address;
    actionInitiator?: string;
  } = {
    address,
  };
  if (user) {
    recoveryAction.actionInitiator = user;
  }
  return recoveryAction;
};

const getEmitDomainReputationPenaltyAndRewardValues = async (
  processedEvents: ProcessedEvent[],
  colonyClient: ColonyClient,
): Promise<Partial<ActionValues>> => {
  const domainReputationChange = processedEvents.find(
    ({ name }) => name === ColonyAndExtensionsEvents.ArbitraryReputationUpdate,
  ) as ProcessedEvent;

  const domainAddedFilter = colonyClient.filters.DomainAdded(null, null);
  const domainAddedEvents = await getEvents(colonyClient, domainAddedFilter);

  const colonyDomains = await Promise.all(
    domainAddedEvents.map(async (domain) => {
      const domainId = parseInt(domain.values.domainId.toString(), 10);
      const { skillId } = await colonyClient.getDomain(domainId);
      return {
        skillId,
        domainId,
      };
    }),
  );

  const {
    address,
    values: { agent, user, amount, skillId },
  } = domainReputationChange;

  const changeDomain = colonyDomains.find((domain) =>
    domain.skillId.eq(skillId),
  );

  const domainReputationChangeAction: {
    address: Address;
    recipient: Address;
    reputationChange: BigNumberish;
    fromDomain?: number;
    actionInitiator?: string;
  } = {
    address,
    recipient: user,
    reputationChange: amount.toString(),
    fromDomain: changeDomain?.domainId,
  };

  if (agent) {
    domainReputationChangeAction.actionInitiator = agent;
  }

  return domainReputationChangeAction;
};

// Motions
export const getMotionState = async (
  motionNetworkState: NetworkMotionState,
  votingClient: ExtensionClient,
  motion,
): Promise<MotionState> => {
  const totalStakeFraction = await votingClient.getTotalStakeFraction();
  const requiredStakes = getMotionRequiredStake(
    motion.skillRep,
    totalStakeFraction,
    18,
  );
  switch (motionNetworkState) {
    case NetworkMotionState.Staking:
      return bigNumberify(motion.stakes[1]).gte(bigNumberify(requiredStakes)) &&
        bigNumberify(motion.stakes[0]).isZero()
        ? MotionState.Staked
        : MotionState.Staking;
    case NetworkMotionState.Submit:
      return MotionState.Voting;
    case NetworkMotionState.Reveal:
      return MotionState.Reveal;
    case NetworkMotionState.Closed:
      return MotionState.Escalation;
    case NetworkMotionState.Finalizable:
    case NetworkMotionState.Finalized: {
      const [nayStakes, yayStakes] = motion.stakes;
      /*
       * Both sides staked fully, we go to a vote
       *
       * @TODO We're using gte as opposed to just eq to counteract a bug on the contracts
       * Once that is fixed, we can switch this back to equals
       */
      if (nayStakes.gte(requiredStakes) && yayStakes.gte(requiredStakes)) {
        const [nayVotes, yayVotes] = motion.votes;
        /*
         * It only passes if the yay votes outnumber the nay votes
         * If the votes are equal, it fails
         */
        if (yayVotes.gt(nayVotes)) {
          return MotionState.Passed;
        }
        return MotionState.Failed;
      }
      /*
       * If we didn't get to a vote, it only passes if the Yay side stakes fully
       * otherwise it fails
       *
       * @TODO We're using gte as opposed to just eq to counteract a bug on the contracts
       * Once that is fixed, we can switch this back to equals
       */
      if (yayStakes.gte(requiredStakes)) {
        return MotionState.Passed;
      }
      return MotionState.Failed;
    }
    case NetworkMotionState.Failed:
      return MotionState.FailedNoFinalizable;
    default:
      return MotionState.Invalid;
  }
};

const getMotionValues = async (
  processedEvents: ProcessedEvent[],
  votingClient: ExtensionClient,
  colonyClient: ColonyClient,
): Promise<Partial<MotionValues>> => {
  const motionCreatedEvent = processedEvents[0];
  const motionId = motionCreatedEvent.values.motionId.toString();
  const motion = await votingClient.getMotion(motionId);
  const motionNetworkState = await votingClient.getMotionState(motionId);
  const motionState = await getMotionState(
    motionNetworkState,
    votingClient,
    motion,
  );
  const tokenAddress = await colonyClient.getToken();

  const motionValues: Partial<MotionValues> = {
    motionNAYStake: motion.stakes[0].toString(),
    motionState,
    address: motionCreatedEvent.address,
    recipient: motion.altTarget,
    actionInitiator: motionCreatedEvent.values.creator,
    tokenAddress,
    motionDomain: motion.domainId.toNumber(),
    rootHash: motion.rootHash,
  };

  return motionValues;
};

const getMintTokensMotionValues = async (
  processedEvents: ProcessedEvent[],
  votingClient: ExtensionClient,
  colonyClient: ColonyClient,
): Promise<Partial<MotionValues>> => {
  const motionCreatedEvent = processedEvents[0];
  const motionId = motionCreatedEvent.values.motionId.toString();
  const motion = await votingClient.getMotion(motionId);
  const values = colonyClient.interface.parseTransaction({
    data: motion.action,
  });
  const motionDefaultValues = await getMotionValues(
    processedEvents,
    votingClient,
    colonyClient,
  );

  const mintTokensMotionValues: {
    amount: string;
  } = {
    ...motionDefaultValues,
    amount: bigNumberify(values.args[0] || '0').toString(),
  };

  return mintTokensMotionValues;
};

const getCreateDomainMotionValues = async (
  processedEvents: ProcessedEvent[],
  votingClient: ExtensionClient,
  colonyClient: ColonyClient,
): Promise<Partial<MotionValues>> => {
  const motionCreatedEvent = processedEvents[0];
  const motionId = motionCreatedEvent.values.motionId.toString();
  const motion = await votingClient.getMotion(motionId);
  const values = colonyClient.interface.parseTransaction({
    data: motion.action,
  });
  const motionDefaultValues = await getMotionValues(
    processedEvents,
    votingClient,
    colonyClient,
  );
  const domainValues = await getDomainValuesFromIPFS(values.args[3]);

  const createDomainMotionValues: {
    domainName: string | null;
    domainColor: number | null;
    domainPurpose: string | null;
  } = {
    ...motionDefaultValues,
    ...domainValues,
  };

  return createDomainMotionValues;
};

const getSetUserRolesMotionValues = async (
  processedEvents: ProcessedEvent[],
  votingClient: ExtensionClient,
  colonyClient: ColonyClient,
): Promise<Partial<MotionValues>> => {
  const motionCreatedEvent = processedEvents[0];
  const motionId = motionCreatedEvent.values.motionId.toString();
  const motion = await votingClient.getMotion(motionId);
  const values = colonyClient.interface.parseTransaction({
    data: motion.action,
  });
  const motionDefaultValues = await getMotionValues(
    processedEvents,
    votingClient,
    colonyClient,
  );

  const roleBitMask = parseInt(hexStripZeros(values.args[4]), 16).toString(2);
  const roleBitMaskArray = roleBitMask.split('').reverse();

  const roles = availableRoles.map((role) => ({
    id: role,
    setTo: roleBitMaskArray[role] === '1',
  }));

  const setUserRolesMotionValues: {
    recipient: Address;
    fromDomain: number;
    roles: ActionUserRoles[];
  } = {
    ...motionDefaultValues,
    recipient: values.args[2],
    fromDomain: bigNumberify(values.args[3]).toNumber(),
    roles,
  };

  return setUserRolesMotionValues;
};

const getEditDomainMotionValues = async (
  processedEvents: ProcessedEvent[],
  votingClient: ExtensionClient,
  colonyClient: ColonyClient,
): Promise<Partial<MotionValues>> => {
  const motionCreatedEvent = processedEvents[0];
  const motionId = motionCreatedEvent.values.motionId.toString();
  const motion = await votingClient.getMotion(motionId);
  const values = colonyClient.interface.parseTransaction({
    data: motion.action,
  });
  const motionDefaultValues = await getMotionValues(
    processedEvents,
    votingClient,
    colonyClient,
  );
  const domainValues = await getDomainValuesFromIPFS(values.args[3]);

  const editDomainMotionValues: {
    domainName: string | null;
    domainColor: number | null;
    domainPurpose: string | null;
    fromDomain: number;
  } = {
    ...motionDefaultValues,
    ...domainValues,
    fromDomain: parseInt(values.args[2].toString(), 10),
  };

  return editDomainMotionValues;
};

const getColonyEditMotionValues = async (
  processedEvents: ProcessedEvent[],
  votingClient: ExtensionClient,
  colonyClient: ColonyClient,
): Promise<Partial<MotionValues>> => {
  const motionCreatedEvent = processedEvents[0];
  const motionId = motionCreatedEvent.values.motionId.toString();
  const motion = await votingClient.getMotion(motionId);
  const values = colonyClient.interface.parseTransaction({
    data: motion.action,
  });
  const motionDefaultValues = await getMotionValues(
    processedEvents,
    votingClient,
    colonyClient,
  );

  let colonyDisplayName = null;
  let colonyAvatarHash = null;
  let colonyTokens = [];
  let ipfsMetadata: any = null;

  try {
    ipfsMetadata = await ipfs.getString(values.args[0]);
  } catch (error) {
    log.verbose(
      'Could not fetch IPFS metadata for colony with hash:',
      values.args[0],
    );
  }

  try {
    if (ipfsMetadata) {
      const {
        colonyDisplayName: displayName,
        colonyAvatarHash: avatarHash,
        colonyTokens: tokenAddresses,
      } = JSON.parse(ipfsMetadata);

      colonyDisplayName = displayName;
      colonyAvatarHash = avatarHash;
      colonyTokens = tokenAddresses;
    }
  } catch (error) {
    log.verbose(
      `Could not parse IPFS metadata for colony, using hash:`,
      values.args[0],
      'with object:',
      ipfsMetadata,
    );
  }

  const colonyEditValues: {
    actionInitiator?: string;
    colonyDisplayName: string | null;
    colonyAvatarHash?: string | null;
    colonyTokens?: string[];
  } = {
    ...motionDefaultValues,
    colonyDisplayName,
    colonyAvatarHash,
    colonyTokens,
  };

  return colonyEditValues;
};

const getPaymentMotionValues = async (
  processedEvents: ProcessedEvent[],
  votingClient: ExtensionClient,
  oneTxPaymentClient: ExtensionClient,
  colonyClient: ColonyClient,
): Promise<Partial<MotionValues>> => {
  const motionCreatedEvent = processedEvents[0];
  const motionId = motionCreatedEvent.values.motionId.toString();
  const motion = await votingClient.getMotion(motionId);
  const values = oneTxPaymentClient.interface.parseTransaction({
    data: motion.action,
  });
  const motionDefaultValues = await getMotionValues(
    processedEvents,
    votingClient,
    colonyClient,
  );

  const paymentMotionValues: {
    amount: string;
    tokenAddress: Address;
    fromDomain: number;
    recipient: Address;
  } = {
    ...motionDefaultValues,
    amount: values.args[6][0].toString(),
    tokenAddress: values.args[5][0],
    fromDomain: values.args[7].toNumber(),
    recipient: values.args[4][0],
  };

  return paymentMotionValues;
};

const getMoveFundsMotionValues = async (
  processedEvents: ProcessedEvent[],
  votingClient: ExtensionClient,
  colonyClient: ColonyClient,
): Promise<Partial<MotionValues>> => {
  const motionCreatedEvent = processedEvents[0];
  const motionId = motionCreatedEvent.values.motionId.toString();
  const motion = await votingClient.getMotion(motionId);
  const values = colonyClient.interface.parseTransaction({
    data: motion.action,
  });
  const motionDefaultValues = await getMotionValues(
    processedEvents,
    votingClient,
    colonyClient,
  );

  const fromDomain = await colonyClient.getDomainFromFundingPot(values.args[5]);
  const toDomain = await colonyClient.getDomainFromFundingPot(values.args[6]);

  const moveFundsMotionValues: {
    amount: string;
    tokenAddress: Address;
    fromDomain: number;
    toDomain: number;
  } = {
    ...motionDefaultValues,
    amount: values.args[7].toString(),
    tokenAddress: values.args[8],
    fromDomain: fromDomain.toNumber(),
    toDomain: toDomain.toNumber(),
  };

  return moveFundsMotionValues;
};

const getVersionUpgradeMotionValues = async (
  processedEvents: ProcessedEvent[],
  votingClient: ExtensionClient,
  colonyClient: ColonyClient,
): Promise<Partial<MotionValues>> => {
  const motionCreatedEvent = processedEvents[0];
  const motionId = motionCreatedEvent.values.motionId.toString();
  const motion = await votingClient.getMotion(motionId);
  const values = colonyClient.interface.parseTransaction({
    data: motion.action,
  });
  const motionDefaultValues = await getMotionValues(
    processedEvents,
    votingClient,
    colonyClient,
  );

  const versionUpgradeMotionValues: {
    newVersion: string;
  } = {
    ...motionDefaultValues,
    newVersion: bigNumberify(values.args[0].toString() || '0').toString(),
  };

  return versionUpgradeMotionValues;
};

const getEmitDomainReputationPenaltyAndRewardMotionValues = async (
  processedEvents: ProcessedEvent[],
  votingClient: ExtensionClient,
  colonyClient: ColonyClient,
): Promise<Partial<MotionValues>> => {
  const motionCreatedEvent = processedEvents[0];
  const motionId = motionCreatedEvent.values.motionId.toString();
  const motion = await votingClient.getMotion(motionId);
  const values = colonyClient.interface.parseTransaction({
    data: motion.action,
  });
  const motionDefaultValues = await getMotionValues(
    processedEvents,
    votingClient,
    colonyClient,
  );

  const reputationChange = (values.args[4] || values.args[2]).toString();
  const recipient = values.args[3] || values.args[1];

  const domainReputationChangeAction: {
    reputationChange: BigNumberish;
    recipient: Address;
  } = {
    ...motionDefaultValues,
    reputationChange,
    recipient,
  };

  return domainReputationChangeAction;
};

export const getActionValues = async (
  processedEvents: ProcessedEvent[],
  colonyClient: ColonyClient,
  votingClient: ExtensionClient,
  oneTxPaymentClient: ExtensionClient,
  actionType: ColonyActions | ColonyMotions,
): Promise<ActionValues> => {
  const fallbackValues = {
    recipient: AddressZero,
    fromDomain: 1,
    toDomain: 1,
    amount: '0',
    tokenAddress: AddressZero,
    newVersion: '0',
    oldVersion: '0',
    address: AddressZero,
    roles: [{ id: 0, setTo: false }],
    reputationChange: '0',
  };

  switch (actionType) {
    case ColonyActions.Payment: {
      const paymentActionValues = await getPaymentActionValues(
        processedEvents,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...paymentActionValues,
      };
    }
    case ColonyActions.MoveFunds: {
      const moveFundsActionValues = await getMoveFundsActionValues(
        processedEvents,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...moveFundsActionValues,
      };
    }
    case ColonyActions.MintTokens: {
      const mintTokensActionValues = await getMintTokensActionValues(
        processedEvents,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...mintTokensActionValues,
      };
    }
    case ColonyActions.CreateDomain: {
      const createDomainActionValues = await getCreateDomainActionValues(
        processedEvents,
      );
      return {
        ...fallbackValues,
        ...createDomainActionValues,
      };
    }
    case ColonyActions.EditDomain: {
      const editDomainActionValues = await getEditDomainActionValues(
        processedEvents,
      );
      return {
        ...fallbackValues,
        ...editDomainActionValues,
      };
    }
    case ColonyActions.VersionUpgrade: {
      const versionUpgradeActionValues = await getVersionUpgradeActionValues(
        processedEvents,
      );
      return {
        ...fallbackValues,
        ...versionUpgradeActionValues,
      };
    }
    case ColonyActions.ColonyEdit: {
      const colonyEditActionValues = await getColonyEditActionValues(
        processedEvents,
      );
      return {
        ...fallbackValues,
        ...colonyEditActionValues,
      };
    }
    case ColonyActions.SetUserRoles: {
      const setUserRolesActionValues = await getSetUserRolesActionValues(
        processedEvents,
      );
      return {
        ...fallbackValues,
        ...setUserRolesActionValues,
      };
    }
    case ColonyActions.Recovery: {
      const recoveryActionValues = await getRecoveryActionValues(
        processedEvents,
      );
      return {
        ...fallbackValues,
        ...recoveryActionValues,
      };
    }
    case ColonyActions.EmitDomainReputationReward:
    case ColonyActions.EmitDomainReputationPenalty: {
      // eslint-disable-next-line max-len
      const emitDomainReputationPenaltyAndRewardActionValues = await getEmitDomainReputationPenaltyAndRewardValues(
        processedEvents,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...emitDomainReputationPenaltyAndRewardActionValues,
      };
    }
    case ColonyMotions.MintTokensMotion: {
      const mintTokensMotionValues = await getMintTokensMotionValues(
        processedEvents,
        votingClient,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...mintTokensMotionValues,
      };
    }
    case ColonyMotions.MoveFundsMotion: {
      const motionValues = await getMoveFundsMotionValues(
        processedEvents,
        votingClient,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...motionValues,
      };
    }
    case ColonyMotions.CreateDomainMotion: {
      const createDomainMotionValues = await getCreateDomainMotionValues(
        processedEvents,
        votingClient,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...createDomainMotionValues,
      };
    }
    case ColonyMotions.EditDomainMotion: {
      const editDomainMotionValues = await getEditDomainMotionValues(
        processedEvents,
        votingClient,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...editDomainMotionValues,
      };
    }
    case ColonyMotions.SetUserRolesMotion: {
      const setUserRolesValues = await getSetUserRolesMotionValues(
        processedEvents,
        votingClient,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...setUserRolesValues,
      };
    }
    case ColonyMotions.ColonyEditMotion: {
      const colonyEditValues = await getColonyEditMotionValues(
        processedEvents,
        votingClient,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...colonyEditValues,
      };
    }
    case ColonyMotions.PaymentMotion: {
      const paymentValues = await getPaymentMotionValues(
        processedEvents,
        votingClient,
        oneTxPaymentClient,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...paymentValues,
      };
    }
    case ColonyMotions.VersionUpgradeMotion: {
      const versionUpgradeMotionValues = await getVersionUpgradeMotionValues(
        processedEvents,
        votingClient,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...versionUpgradeMotionValues,
      };
    }
    case ColonyMotions.EmitDomainReputationRewardMotion:
    case ColonyMotions.EmitDomainReputationPenaltyMotion: {
      // eslint-disable-next-line max-len
      const emitDomainReputationPenaltyAndRewardMotionValues = await getEmitDomainReputationPenaltyAndRewardMotionValues(
        processedEvents,
        votingClient,
        colonyClient,
      );
      return {
        ...fallbackValues,
        ...emitDomainReputationPenaltyAndRewardMotionValues,
      };
    }
    default: {
      return fallbackValues;
    }
  }
};

export const getDomainsforMoveFundsActions = async (
  colonyAddress: string,
  actions: FormattedAction[],
  colonyManager: any,
) => {
  const colonyClient = await colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  return Promise.all(
    actions.map(async (action) => {
      if (action.actionType !== ColonyActions.MoveFunds) {
        return action;
      }

      const fromDomain = await colonyClient.getDomainFromFundingPot(
        action.fromDomain,
      );
      const toDomain = await colonyClient.getDomainFromFundingPot(
        action.toDomain,
      );

      return {
        ...action,
        fromDomain: bigNumberify(fromDomain).toString(),
        toDomain: bigNumberify(toDomain).toString(),
      };
    }),
  );
};

export const groupSetUserRolesActions = (actions): FormattedAction[] => {
  const groupedActions: FormattedAction[] = [];

  actions.forEach((actionA) => {
    if (actionA.actionType === ColonyActions.SetUserRoles) {
      if (
        groupedActions.findIndex(
          (groupedAction) =>
            actionA.transactionHash === groupedAction.transactionHash,
        ) === -1
      ) {
        const filteredActionsByHash = actions.filter(
          ({ transactionHash, actionType }) =>
            actionType === ColonyActions.SetUserRoles &&
            actionA.transactionHash === transactionHash,
        );
        const actionRoles = filteredActionsByHash.reduce(
          (roles, filteredAction) => {
            if (filteredAction?.roles) {
              return [
                ...roles,
                {
                  id: filteredAction?.roles[0]?.id,
                  setTo: filteredAction?.roles[0]?.setTo,
                },
              ];
            }
            return roles;
          },
          [],
        );
        groupedActions.push({
          ...actionA,
          roles: actionRoles,
        });
      }
    } else {
      groupedActions.push(actionA);
    }
  });

  return groupedActions;
};

export const getMotionActionType = async (
  votingClient: ExtensionClient,
  oneTxPaymentClient: ExtensionClient,
  colonyClient: ColonyClient,
  motionId: BigNumberish,
) => {
  const motion = await votingClient.getMotion(motionId);
  const values = colonyClient.interface.parseTransaction({
    data: motion.action,
  });

  if (!values) {
    const paymentValues = oneTxPaymentClient.interface.parseTransaction({
      data: motion.action,
    });
    return motionNameMapping[paymentValues.name];
  }

  return motionNameMapping[values.name];
};
