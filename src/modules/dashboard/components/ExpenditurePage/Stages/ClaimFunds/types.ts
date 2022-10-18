import { Token } from '~data/index';

export interface TokenData {
  amount: number;
  token?: Token | undefined;
}

export interface ClaimData {
  totalClaimable: TokenData[] | undefined;
  claimableNow: TokenData[] | undefined;
  claimed: TokenData[] | undefined;
  nextClaim: {
    claimDate: number | undefined;
    claimed: boolean | undefined;
  };
  buttonIsActive: boolean | undefined;
}
