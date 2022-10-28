import { BigNumber } from 'ethers/utils';
import { UserToken } from '~data/generated';

export interface UserTokenBalanceData {
  nativeToken: UserToken;
  inactiveBalance: BigNumber;
  lockedBalance: BigNumber;
  activeBalance: BigNumber;
  totalBalance: BigNumber;
  isPendingBalanceZero: boolean;
}
