/* eslint-disable max-len */

import { ColonyAndExtensionsEvents } from '~types/index';

const eventsMessageDescriptors = {
  'event.title': `{eventName, select,
      ${ColonyAndExtensionsEvents.OneTxPaymentMade} {{initiator} paid {amount} {tokenSymbol} from {fromDomain} to {recipient}}
      ${ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots} {{initiator} transferred {amount} {tokenSymbol} from the {fromDomain} to {toDomain}}
      ${ColonyAndExtensionsEvents.TokenUnlocked} {The native token {tokenSymbol} was unlocked}
      ${ColonyAndExtensionsEvents.TokensMinted} {{initiator} minted {amount} {tokenSymbol} to {recipient}}
      ${ColonyAndExtensionsEvents.DomainAdded} {{initiator} added Team: {fromDomain}}
      ${ColonyAndExtensionsEvents.ColonyUpgraded} {This colony has upgraded to {newVersion}}
      ${ColonyAndExtensionsEvents.RecoveryModeEntered} {{initiator} activated Recovery Mode}
      ${ColonyAndExtensionsEvents.RecoveryStorageSlotSet} {{user} submitted new value for slot {storageSlot}}
      ${ColonyAndExtensionsEvents.RecoveryModeExitApproved} {{user} approved exiting}
      ${ColonyAndExtensionsEvents.RecoveryModeExited} {{user} exited Recovery Mode}
      ${ColonyAndExtensionsEvents.MotionCreated} {{initiator} created a {motionTag}}
      ${ColonyAndExtensionsEvents.MotionStaked} {{staker} backed the {backedSideTag} by staking {amountTag}}
      ${ColonyAndExtensionsEvents.MotionFinalized} {{motionTag} was finalized. Stakes may be claimed.}
      ${ColonyAndExtensionsEvents.ObjectionRaised} {{staker} raised an {objectionTag}}
      ${ColonyAndExtensionsEvents.MotionRewardClaimed} {{staker} claimed their stake.}
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
  [`event.${ColonyAndExtensionsEvents.ColonyRoleSet}.assign`]: `{initiator} assigned the {role} permission in the {fromDomain} team to {recipient}`,
  [`event.${ColonyAndExtensionsEvents.ColonyRoleSet}.remove`]: `{initiator} removed the {role} permission in the {fromDomain} team from {recipient}`,
  [`event.${ColonyAndExtensionsEvents.UserApproved}.assign`]: `User {agent} got approved in the whitelist`,
  [`event.${ColonyAndExtensionsEvents.UserApproved}.remove`]: `User {agent} got removed from the whitelist`,
  [`event.${ColonyAndExtensionsEvents.ArbitraryReputationUpdate}.title`]: `{initiator} {isSmiteAction, select,
    true {smote}
    false {awarded}
  } {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation {isSmiteAction, select,
    true {penalty}
    false {reward}
  }`,
  'eventList.event': `{eventName, select,
      ${ColonyAndExtensionsEvents.DomainAdded} {{agent} added Team: {domain}}
      ${ColonyAndExtensionsEvents.DomainMetadata} {{agent} changed Team {domain} metadata to {metadata}}
      ${ColonyAndExtensionsEvents.Annotation} {{agent} annotated transaction {transactionHash} with {metadata}}
      ${ColonyAndExtensionsEvents.FundingPotAdded} {Funding pot {fundingPot} added}
      ${ColonyAndExtensionsEvents.ColonyInitialised} {{agent} created a colony with token {tokenSymbol} at address {tokenAddress}}
      ${ColonyAndExtensionsEvents.OneTxPaymentMade} {{agent} created an OneTx payment}
      ${ColonyAndExtensionsEvents.TokenUnlocked} {Unlocked the native token {tokenSymbol}}
      ${ColonyAndExtensionsEvents.TokensMinted} {{agent} minted {amount} {tokenSymbol}}
      ${ColonyAndExtensionsEvents.ColonyFundsClaimed} {{agent} claimed {amount} {tokenSymbol} for colony}
      ${ColonyAndExtensionsEvents.PaymentAdded} {{agent} added payment with id {paymentId}}
      ${ColonyAndExtensionsEvents.PaymentRecipientSet} {{agent} added {recipient} as recipient to payment {paymentId}}
      ${ColonyAndExtensionsEvents.PaymentPayoutSet} {{agent} added {amount} {tokenSymbol} as payout to payment {paymentId}}
      ${ColonyAndExtensionsEvents.PaymentFinalized} {{agent} finalized payment with id {paymentId}}
      ${ColonyAndExtensionsEvents.PayoutClaimed} {{agent} claimed a payout of {amount} {tokenSymbol} from funding pot {fundingPot}}
      ${ColonyAndExtensionsEvents.ColonyMetadata} {{agent} changed Colony metadata to {metadata}}
      ${ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots} {{agent} transferred {amount} {tokenSymbol} between pots}
      ${ColonyAndExtensionsEvents.ExtensionInstalled} {Extension was installed {extensionHash} version {extensionVersion}}
      ${ColonyAndExtensionsEvents.ExtensionInitialised} {Extension was initialised}
      ${ColonyAndExtensionsEvents.ExtensionDeprecated} {Extension was deprecated {extensionHash}}
      ${ColonyAndExtensionsEvents.ExtensionUpgraded} {Extension was upgraded to {extensionVersion} {extensionHash}}
      ${ColonyAndExtensionsEvents.ExtensionUninstalled} {Extension was uninstalled {extensionHash}}
      ${ColonyAndExtensionsEvents.ColonyUpgraded} {Colony was upgraded from version {oldVersion} to {newVersion}}
      ${ColonyAndExtensionsEvents.RecoveryModeEntered} {{agent} entered the colony into Recovery Mode}
      ${ColonyAndExtensionsEvents.RecoveryStorageSlotSet} {{agent} set storage slot {storageSlot} to {storageSlotValue}}
      ${ColonyAndExtensionsEvents.RecoveryModeExitApproved} {{agent} approved exiting the Recovery Mode}
      ${ColonyAndExtensionsEvents.RecoveryModeExited} {{agent} exited the colony from Recovery Mode}
      ${ColonyAndExtensionsEvents.PeriodUpdated} {Coin machine period updated from {activePeriod} to {currentPeriod}}
      ${ColonyAndExtensionsEvents.TokensBought} {{agent} bought {amount} {tokenSymbol}}
      ${ColonyAndExtensionsEvents.MotionCreated} {{agent} created motion {motionId} in {domain}}
      ${ColonyAndExtensionsEvents.MotionStaked} {{agent} {voteSide} motion {motionId} for {amount} {tokenSymbol}}
      ${ColonyAndExtensionsEvents.MotionVoteSubmitted} {{agent} voted in motion {motionId}}
      ${ColonyAndExtensionsEvents.MotionVoteRevealed} {{agent} revealed his vote in motion {motionId}}
      ${ColonyAndExtensionsEvents.MotionFinalized} {Motion {motionId} in {domain} was finalized}
      ${ColonyAndExtensionsEvents.MotionEscalated} {{agent} escalated motion {motionId} from {domain} to {newDomain}}
      ${ColonyAndExtensionsEvents.MotionRewardClaimed} {{agent} claimed their stake in motion {motionId}}
      ${ColonyAndExtensionsEvents.MotionEventSet} {Motion {motionId} fast-forwarded to the next lifecycle}
      ${ColonyAndExtensionsEvents.AgreementSigned} {User {agent} signed the whitelist agreement}
      other {{eventName} emmited with values: {displayValues}}
    }`,
  [`eventList.${ColonyAndExtensionsEvents.ColonyRoleSet}.assign`]: `{agent} assigned the {role} permission in the {domain} team to {recipient}`,
  [`eventList.${ColonyAndExtensionsEvents.ColonyRoleSet}.remove`]: `{agent} removed the {role} permission in the {domain} team from {recipient}`,
  [`eventList.${ColonyAndExtensionsEvents.RecoveryRoleSet}.assign`]: `The Recovery role was assigned to {recipient}`,
  [`eventList.${ColonyAndExtensionsEvents.RecoveryRoleSet}.remove`]: `The Recovery role was removed from {recipient}`,
  [`eventList.${ColonyAndExtensionsEvents.ArbitraryReputationUpdate}.title`]: `{agent} {isSmiteAction, select,
    true {smote}
    false {awarded}
  } {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation {isSmiteAction, select,
    true {penalty}
    false {reward}
  }`,
};

export default eventsMessageDescriptors;
