import { TokenData } from './types';

export const getClaimData = (tokens: TokenData | TokenData[] | undefined) => {
  if (!tokens) {
    return undefined;
  }

  if (Array.isArray(tokens)) {
    return {
      totalClaimable: tokens,
      claimableNow: tokens,
      claimed: tokens.map(
        (tokenItem) => tokenItem && { ...tokenItem, amount: 0 },
      ),
      buttonIsActive: true,
    };
  }

  return {
    totalClaimable: tokens && [tokens],
    buttonIsActive: true,
    claimableNow: tokens && [tokens],
    claimed: [{ ...tokens, amount: 0 }],
  };
};
