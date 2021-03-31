import {
  ColonyClient,
  ColonyClientV5,
  ClientType,
  getLogs,
  VotingReputationClient,
} from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';
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

import { getSetUserRolesMessageDescriptorsIds } from '../colonyActions';

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
}

export enum MotionState {
  Null = 0,
  Staking = 1,
  Submit = 2,
  Reveal = 3,
  Closed = 4,
  Finalizable = 5,
  Finalized = 6,
  Failed = 7
}

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
            return filteredParsedEvents[eventIndex].name === eventName;
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
  actionType: ColonyActions,
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

  const ipfsData = await ipfs.getString(metadata);
  const {
    domainName = null,
    domainPurpose = null,
    domainColor = null,
  } = JSON.parse(ipfsData);

  const domainMetadataValues: {
    address: Address;
    fromDomain: number;
    actionInitiator?: string;
    domainPurpose?: string;
    domainName: string;
    domainColor?: string;
  } = {
    address,
    fromDomain: parseInt(domainId.toString(), 10),
    domainName,
    domainPurpose,
    domainColor,
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

// Motions
const getMintTokensMotionValues = async (
  processedEvents: ProcessedEvent[],
  votingClient: VotingReputationClient,
  colonyClient: ColonyClient,
): Promise<Partial<ActionValues>> => {
  const motionCreatedEvent = processedEvents[0];
  const motionid = motionCreatedEvent.values.motionId.toString()
  const motion = await votingClient.getMotion(motionid);
  const motionState = await votingClient.getMotionState(motionid);
  const values = colonyClient.interface.parseTransaction({data: motion.action});
  const tokenAddress = await colonyClient.getToken();

  const mintTokensMotionValues: {
    state: MotionState;
    address: Address;
    amount: string;
    actionInitiator: string;
    recipient: Address;
    tokenAddress: Address;
  } = {
    state: motionState,
    address: motionCreatedEvent.address,
    recipient: motion.altTarget,
    actionInitiator: motionCreatedEvent.values.creator,
    amount: bigNumberify(values.args[0] || '0').toString(),
    tokenAddress
  };

  return mintTokensMotionValues;
};

export const getActionValues = async (
  processedEvents: ProcessedEvent[],
  colonyClient: ColonyClient,
  votingClient: VotingReputationClient,
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
    case ColonyMotions.MintTokensMotion: {
      const mintTokensMotionValues = await getMintTokensMotionValues(
        processedEvents,
        votingClient,
        colonyClient
      );
      return {
        ...fallbackValues,
        ...mintTokensMotionValues
      };
    };
    default: {
      return fallbackValues;
    }
  }
};

export const getAnnotation = async (
  agent: Address,
  transactionHash: string,
  /*
   * @NOTE Only version 5 of colony has access to the Annotation
   * (both filter and the actual method call)
   */
  colonyClient: ColonyClientV5,
) => {
  /*
   * @TODO For some reason types were not autogenerated in colonyJS for this filter
   * I need, at some point, to investigate what's up
   */
  const filter = colonyClient.filters.Annotation(agent, transactionHash, null);
  const allColonyAnnotationLogs = await getLogs(colonyClient, filter);
  const allColonyParseAnnotations = allColonyAnnotationLogs.map(
    (annotationLog) => colonyClient.interface.parseLog(annotationLog),
  );
  return allColonyParseAnnotations.pop();
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

export const getActionTitleMessageDescriptor = (
  actionType: ColonyActions,
  roleSetTo: boolean,
): string => {
  switch (actionType) {
    case ColonyActions.SetUserRoles:
      return getSetUserRolesMessageDescriptorsIds(roleSetTo);
    default:
      return 'action.title';
  }
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
  votingClient: VotingReputationClient,
  colonyClient: ColonyClient,
  motionCreatedEvent: any,
) => {
  const motionid = motionCreatedEvent.values.motionId.toString()
  const motion = await votingClient.getMotion(motionid);
  const values = colonyClient.interface.parseTransaction({data: motion.action});
  return motionNameMapping[values.name];
};
