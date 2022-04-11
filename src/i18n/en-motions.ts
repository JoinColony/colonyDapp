import { ColonyMotions } from '~types/index';

const motionsMessageDescriptors = {
  'motion.title': `{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint {amount} {tokenSymbol}}
      ${ColonyMotions.CreateDomainMotion} {New team: {fromDomainName}}
      ${ColonyMotions.EditDomainMotion} {Edit {fromDomainName} team details}
      ${ColonyMotions.ColonyEditMotion} {Change colony details}
      ${ColonyMotions.PaymentMotion} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyMotions.VersionUpgradeMotion}
        {Upgrade Colony to Version {newVersion}!}
      ${ColonyMotions.MoveFundsMotion}
        {Move {amount} {tokenSymbol} from {fromDomainName} to {toDomainName}}
      ${ColonyMotions.EmitDomainReputationPenaltyMotion}
        {Smite {recipient} with a {reputationChangeNumeral}
        {reputationChange, plural,
          one {pt}
          other {pts}
        } reputation penalty}
      ${ColonyMotions.EmitDomainReputationRewardMotion}
        {Award {recipient} with a {reputationChangeNumeral}
        {reputationChange, plural,
          one {pt}
          other {pts}
        } reputation reward}
      ${ColonyMotions.UnlockTokenMotion} {Unlock native token {tokenSymbol}}
      other {Generic motion we don't have information about}
    }`,
  [`motion.${ColonyMotions.SetUserRolesMotion}.assign`]: `Assign the {roles} in {fromDomainName} to {recipient}`,
  [`motion.${ColonyMotions.SetUserRolesMotion}.remove`]: `Remove the {roles} in {fromDomainName} from {recipient}`,
  [`motion.${ColonyMotions.SetUserRolesMotion}.assignAndRemove`]: `{roles} in {fromDomainName} to/from {recipient}`,
  'motion.type': `{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint Tokens}
      ${ColonyMotions.PaymentMotion} {Payment}
      ${ColonyMotions.CreateDomainMotion} {Create Team}
      ${ColonyMotions.EditDomainMotion} {Edit Team}
      ${ColonyMotions.ColonyEditMotion} {Colony Edit}
      ${ColonyMotions.SetUserRolesMotion} {Permission Management}
      ${ColonyMotions.MoveFundsMotion} {Move Funds}
      ${ColonyMotions.VersionUpgradeMotion} {Version Upgrade}
      ${ColonyMotions.EmitDomainReputationPenaltyMotion} {Smite}
      ${ColonyMotions.EmitDomainReputationRewardMotion} {Award}
      ${ColonyMotions.UnlockTokenMotion} {Unlock Token}
      other {Generic}
    }`,
};

export default motionsMessageDescriptors;
