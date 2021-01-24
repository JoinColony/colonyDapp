/* eslint-disable max-len */
import { ColonyAndExtensionsEvents } from '~types/index';

const eventsMessageDescriptors = {
  'event.title': `{eventName, select,
      ${ColonyAndExtensionsEvents.OneTxPaymentMade} {{initiator} paid {amount} {tokenSymbol} from {fromDomain} to {recipient}}
      ${ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots} {{initiator} transferred {amount} {tokenSymbol} from the {fromDomain} to the {toDomain}}
      ${ColonyAndExtensionsEvents.TokensMinted} {{initiator} minted {amount} {tokenSymbol} to {recipient}}
      ${ColonyAndExtensionsEvents.DomainAdded} {{initiator} added Team: {fromDomain}}
      ${ColonyAndExtensionsEvents.ColonyUpgraded} {This colony has upgraded to {newVersion}}
      other {{eventNameDecorated} emmited by {clientOrExtensionType}}
    }`,
  /*
   * This needs to be declared separely since we can't nest select declarations
   */
  [`event.${ColonyAndExtensionsEvents.ColonyMetadata}.nameLogo`]: `{initiator} changed this colony's name to {colonyName} and it's logo`,
  [`event.${ColonyAndExtensionsEvents.ColonyMetadata}.name`]: `{initiator} changed this colony's name to {colonyName}`,
  [`event.${ColonyAndExtensionsEvents.ColonyMetadata}.logo`]: `{initiator} changed this colony's logo`,
  [`event.${ColonyAndExtensionsEvents.ColonyMetadata}.tokens`]: `{initiator} changed this colony's tokens`,
  [`event.${ColonyAndExtensionsEvents.ColonyMetadata}.fallback`]: `{initiator} changed this colony's metadata, but the values are the same`,
};

export default eventsMessageDescriptors;
