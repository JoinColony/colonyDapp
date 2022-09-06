/* eslint-disable max-len */

import {
  ColonyActions,
  ColonyMotions,
  ColonyExtendedActions,
} from '~types/index';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${ColonyActions.WrongColony} {Unknown Action}
      ${ColonyActions.Payment} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyMotions.PaymentMotion} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyActions.MoveFunds} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      ${ColonyMotions.MoveFundsMotion} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      ${ColonyActions.UnlockToken} {Unlock native token {tokenSymbol}}
      ${ColonyMotions.UnlockTokenMotion} {Unlock native token {tokenSymbol}}
      ${ColonyActions.MintTokens} {Mint {amount} {tokenSymbol}}
      ${ColonyMotions.MintTokensMotion} {Mint {amount} {tokenSymbol}}
      ${ColonyActions.CreateDomain} {New team: {fromDomain}}
      ${ColonyMotions.CreateDomainMotion} {New team: {fromDomain}}
      ${ColonyActions.VersionUpgrade} {Upgrade Colony to Version {newVersion}!}
      ${ColonyMotions.VersionUpgradeMotion} {Upgrade Colony to Version {newVersion}!}
      ${ColonyActions.ColonyEdit} {Colony details changed}
      ${ColonyMotions.ColonyEditMotion} {Change colony details}
      ${ColonyActions.EditDomain} {{fromDomain} team details edited}
      ${ColonyMotions.EditDomainMotion} {Edit {fromDomain} team details}
      ${ColonyActions.Recovery} {Recovery mode activated by {initiator}}
      ${ColonyActions.EmitDomainReputationPenalty} {Smite {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation penalty}
      ${ColonyMotions.EmitDomainReputationPenaltyMotion} {Smite {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation penalty}
      ${ColonyActions.EmitDomainReputationReward} {Award {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation reward}
      ${ColonyMotions.EmitDomainReputationRewardMotion} {Award {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation reward}
      ${ColonyExtendedActions.AddressBookUpdated} {Address book was updated}
      ${ColonyExtendedActions.TokensUpdated} {Colony tokens were updated}
      ${ColonyExtendedActions.SafeRemoved} {Remove Safe}
      ${ColonyExtendedActions.SafeAdded} {Add Safe from {chainName}}
      ${ColonyExtendedActions.SafeTransactionInitiated} {{safeTransactionTitle}}
      other {Generic action we don't have information about}
    }`,
  [`action.${ColonyActions.SetUserRoles}.assign`]: `Assign the {roles} in {fromDomain} to {recipient}`,
  [`action.${ColonyMotions.SetUserRolesMotion}.assign`]: `Assign the {roles} in {fromDomain} to {recipient}`,
  [`action.${ColonyActions.SetUserRoles}.remove`]: `Remove the {roles} in {fromDomain} from {recipient}`,
  [`action.${ColonyMotions.SetUserRolesMotion}.remove`]: `Remove the {roles} in {fromDomain} from {recipient}`,
  [`action.${ColonyActions.SetUserRoles}.assignAndRemove`]: `{roles} in {fromDomain} to/from {recipient}`,
  [`action.${ColonyMotions.SetUserRolesMotion}.assignAndRemove`]: `{roles} in {fromDomain} to/from {recipient}`,
  'action.type': `{actionType, select,
      ${ColonyActions.WrongColony} {Not part of the Colony}
      ${ColonyActions.Payment} {Payment}
      ${ColonyActions.MoveFunds} {Move Funds}
      ${ColonyActions.UnlockToken} {Unlock Token}
      ${ColonyActions.MintTokens} {Mint Tokens}
      ${ColonyActions.CreateDomain} {Create Team}
      ${ColonyActions.VersionUpgrade} {Version Upgrade}
      ${ColonyActions.ColonyEdit} {Colony Edit}
      ${ColonyActions.EditDomain} {Edit Team}
      ${ColonyActions.SetUserRoles} {Permission Management}
      ${ColonyActions.Recovery} {Recovery}
      ${ColonyActions.EmitDomainReputationPenalty} {Smite}
      ${ColonyActions.EmitDomainReputationReward} {Award}
      ${ColonyExtendedActions.SafeAdded} {Add Safe}
      ${ColonyExtendedActions.SafeRemoved} {Remove Safe}
      ${ColonyExtendedActions.TokensUpdated} {Update Tokens}
      ${ColonyExtendedActions.AddressBookUpdated} {Update Address Book}
      other {Generic}
    }`,
  [`action.type.${ColonyExtendedActions.SafeTransactionInitiated}.rawTransaction`]: `Raw transaction`,
  [`action.type.${ColonyExtendedActions.SafeTransactionInitiated}.transferFunds`]: `Transfer funds`,
  [`action.type.${ColonyExtendedActions.SafeTransactionInitiated}.transferNFT`]: `Transfer NFT`,
  [`action.type.${ColonyExtendedActions.SafeTransactionInitiated}.contractInteraction`]: `Contract interaction`,
  [`action.type.${ColonyExtendedActions.SafeTransactionInitiated}.multipleTransactions`]: `Multiple transactions`,
};

export default actionsMessageDescriptors;
