/* eslint-disable max-len */

import { ColonyAndExtensionsEvents } from '~types/index';

const eventsMessageDescriptors = {
  'event.title': `{eventName, select,
      ${ColonyAndExtensionsEvents.OneTxPaymentMade} {{initiator} paid {amount} {tokenSymbol} from {fromDomain} to {recipient}}
      ${ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots} {{initiator} transferred {amount} {tokenSymbol} from the {fromDomain} to {toDomain}}
      ${ColonyAndExtensionsEvents.TokensMinted} {{initiator} minted {amount} {tokenSymbol} to {recipient}}
      ${ColonyAndExtensionsEvents.DomainAdded} {{initiator} added Team: {fromDomain}}
      ${ColonyAndExtensionsEvents.ColonyUpgraded} {This colony has upgraded to {newVersion}}
      ${ColonyAndExtensionsEvents.ColonyRoleSet} {{initiator} assigned the {role} permission in the {toDomain} team to {recipient}}
      other {{eventNameDecorated} emmited by {clientOrExtensionType}}
    }`,
  /*
   * This needs to be declared separely since we can't nest select declarations
   */
  [`event.${ColonyAndExtensionsEvents.ColonyMetadata}.nameLogo`]: `{initiator} changed this colony's name to {colonyName} and its logo`,
  [`event.${ColonyAndExtensionsEvents.ColonyMetadata}.name`]: `{initiator} changed this colony's name to {colonyName}`,
  [`event.${ColonyAndExtensionsEvents.ColonyMetadata}.logo`]: `{initiator} changed this colony's logo`,
  [`event.${ColonyAndExtensionsEvents.ColonyMetadata}.tokens`]: `{initiator} changed this colony's tokens`,
  [`event.${ColonyAndExtensionsEvents.ColonyMetadata}.fallback`]: `{initiator} changed this colony's metadata, but the values are the same`,
  [`event.${ColonyAndExtensionsEvents.DomainMetadata}.all`]: `{initiator} changed teams's name, description, color from {oldName}, {oldDescription}, {oldColor} to {domainName}, {domainPurpose}, {domainColor}`,
  [`event.${ColonyAndExtensionsEvents.DomainMetadata}.nameDescription`]: `{initiator} changed teams's name and description from {oldName}, {oldDescription} to {domainName}, {domainPurpose}`,
  [`event.${ColonyAndExtensionsEvents.DomainMetadata}.nameColor`]: `{initiator} changed teams's name and color from {oldName}, {oldColor} to {domainName}, {domainColor}`,
  [`event.${ColonyAndExtensionsEvents.DomainMetadata}.descriptionColor`]: `{initiator} changed teams's description and color from {oldDescription}, {oldColor} to {domainPurpose}, {domainColor}`,
  [`event.${ColonyAndExtensionsEvents.DomainMetadata}.description`]: `{initiator} changed teams's description from {oldDescription} to {domainPurpose}`,
  [`event.${ColonyAndExtensionsEvents.DomainMetadata}.name`]: `{initiator} changed teams's name from {oldName} to {domainName}`,
  [`event.${ColonyAndExtensionsEvents.DomainMetadata}.color`]: `{initiator} changed teams's color from {oldColor} to {domainColor}`,
  [`event.${ColonyAndExtensionsEvents.DomainMetadata}.fallback`]: `{initiator} changed this team, but values are the same`,
  'eventList.event': `{eventName, select,
      ${ColonyAndExtensionsEvents.DomainAdded} {{agent} added Team: {domain}}
      ${ColonyAndExtensionsEvents.DomainMetadata} {{agent} changed Team {domain} metadata to {metadata}}
      ${ColonyAndExtensionsEvents.Annotation} {{agent} annotated transaction {transactionHash} with {metadata}}
      ${ColonyAndExtensionsEvents.FundingPotAdded} {Funding pot {fundingPot} added}
      ${ColonyAndExtensionsEvents.ColonyInitialised} {{agent} created a colony with token {tokenSymbol} at address {tokenAddress}}
      ${ColonyAndExtensionsEvents.OneTxPaymentMade} {{agent} created an OneTx payment}
      ${ColonyAndExtensionsEvents.TokensMinted} {{agent} minted {amount} {tokenSymbol}}
      ${ColonyAndExtensionsEvents.ColonyFundsClaimed} {{agent} claimed {amount} {tokenSymbol} for colony}
      ${ColonyAndExtensionsEvents.PaymentAdded} {{agent} added payment with id {paymentId}}
      ${ColonyAndExtensionsEvents.PaymentRecipientSet} {{agent} added {recipient} as recipient to payment {paymentId}}
      ${ColonyAndExtensionsEvents.PaymentPayoutSet} {{agent} added {amount} {tokenSymbol} as payout to payment {paymentId}}
      ${ColonyAndExtensionsEvents.PaymentFinalized} {{agent} finalized payment with id {paymentId}}
      ${ColonyAndExtensionsEvents.PayoutClaimed} {{agent} claimed a payout of {amount} {tokenSymbol} from funding pot {fundingPot}}
      ${ColonyAndExtensionsEvents.ColonyMetadata} {{agent} changed Colony metadata to {metadata}}
      ${ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots} {{agent} transferred {amount} {tokenSymbol} between pots}
      other {{eventName} emmited with values: {displayValues}}
    }`,
};

export default eventsMessageDescriptors;
