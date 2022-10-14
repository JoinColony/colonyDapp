import { AnyToken } from '~data/index';

export interface TokenData {
  amount: number;
  token?: AnyToken | undefined;
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
