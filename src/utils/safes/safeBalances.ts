import { AddressZero } from 'ethers/constants';
import { SafeBalance } from '~dashboard/Dialogs/ControlSafeDialog/ControlSafeDialog';
import { Address } from '~types/index';

export const getSelectedSafeBalance = (
  safeBalances?: SafeBalance[] | null,
  selectedTokenAddress?: Address,
) =>
  safeBalances?.find(
    (balance) =>
      balance.tokenAddress === selectedTokenAddress ||
      (!balance.tokenAddress && selectedTokenAddress === AddressZero),
  );
