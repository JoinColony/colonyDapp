import { BigNumber, bigNumberify } from 'ethers/utils';
import { WeiPerEther } from 'ethers/constants';
import Decimal from 'decimal.js';

import { WhitelistPolicy } from '~types/index';

/*
 * Replicates the period price evolution logic that is being done by the
 * Coin Machine Extension contracts:
 * https://github.com/JoinColony/colonyNetwork/blob/develop/contracts/extensions/CoinMachine.sol#L265-L278
 */
export const getCoinMachinePeriodPrice = (
  windowSize = 24,
  targetPerPeriod: BigNumber = bigNumberify(0),
  prevPrice: BigNumber = bigNumberify(0),
  prevTokensBought: BigNumber = bigNumberify(0),
): BigNumber => {
  const WAD = WeiPerEther;

  let inMemoryEMAIntake = prevPrice.mul(targetPerPeriod);

  /*
   * We need to use BigDecimal here since we're dealing with decimal values
   * At the end we convert it back to a BigNumber
   */
  const alpha = bigNumberify(
    new Decimal(2 / (windowSize + 1))
      .mul(new Decimal(WAD.toString()))
      .toString(),
  );
  const activeIntake = prevPrice.mul(prevTokensBought);
  inMemoryEMAIntake = WAD.sub(alpha)
    .mul(inMemoryEMAIntake)
    .add(alpha.mul(activeIntake))
    .div(WAD);

  return inMemoryEMAIntake.div(targetPerPeriod);
};

export const getCoinMachinePreDecayPeriodPrice = (
  windowSize = 24,
  nextPrice: BigNumber = bigNumberify(0),
): BigNumber => {
  const WAD = WeiPerEther;

  /*
   * We need to use BigDecimal here since we're dealing with decimal values
   * At the end we convert it back to a BigNumber
   */
  const alpha = bigNumberify(
    new Decimal(2 / (windowSize + 1))
      .mul(new Decimal(WAD.toString()))
      .toString(),
  );

  return nextPrice.mul(WAD).div(WAD.sub(alpha));
};

export const getWhitelistPolicy = (
  useApprovals = false,
  useAgreements = false,
): WhitelistPolicy => {
  let policyType: WhitelistPolicy = WhitelistPolicy.KycOnly;
  if (useAgreements) {
    policyType = WhitelistPolicy.AgreementOnly;
  }
  if (useApprovals && useAgreements) {
    policyType = WhitelistPolicy.KycAndAgreement;
  }
  return policyType;
};
