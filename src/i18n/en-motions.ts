import { ColonyMotions } from '~types/index';

const motionsMessageDescriptors = {
  'motion.title': `{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint {amount} {tokenSymbol}}
      ${ColonyMotions.CreateDomainMotion} {New team: {domainName}}
      ${ColonyMotions.EditDomainMotion} {{domainName} team details edited}
      ${ColonyMotions.ColonyEditMotion} {Colony details changed}
      ${ColonyMotions.PaymentMotion} {Pay {recipient} {amount} {tokenSymbol}}
      other {Generic motion we don't have information about}
    }`,
  [`motion.${ColonyMotions.SetUserRolesMotion}.assign`]: `Assign the {roles} in {domainName} to {recipient}`,
  [`motion.${ColonyMotions.SetUserRolesMotion}.remove`]: `Remove the {roles} in {domainName} from {recipient}`,
  [`motion.${ColonyMotions.SetUserRolesMotion}.assignAndRemove`]: `{roles} in {domainName} to/from {recipient}`,
  'motion.type': `{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint Tokens}
      ${ColonyMotions.PaymentMotion} {Payment}
      ${ColonyMotions.CreateDomainMotion} {Create Team}
      ${ColonyMotions.EditDomainMotion} {Edit Team}
      ${ColonyMotions.ColonyEditMotion} {Colony Edit}
      ${ColonyMotions.SetUserRolesMotion} {Permission Management}
      ${ColonyMotions.MoveFundsMotion} {Move Funds}
      ${ColonyMotions.VersionUpgradeMotion} {Version Upgrade}
      other {Generic}
    }`,
};

export default motionsMessageDescriptors;
