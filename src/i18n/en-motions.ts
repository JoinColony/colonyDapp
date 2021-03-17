import { ColonyMotions } from '~types/index';

const motionsMessageDescriptors = {
  'motion.title': `{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint {amount} {tokenSymbol}}
      other {Generic action we don't have information about}
    }`,
  'motion.type': `{actionType, select,
      ${ColonyMotions.MintTokensMotion} {Mint Tokens}
      other {Generic}
    }`,
};

export default motionsMessageDescriptors;
