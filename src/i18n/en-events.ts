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
  [`event.${ColonyAndExtensionsEvents.ColonyMetadata}title`]: `{logoChanged, select,
    true {{initiator} changed this colony's name to {colonyName} and logo}
    false {{initiator} changed this colony's name to {colonyName}}
  }`,
};

export default eventsMessageDescriptors;
