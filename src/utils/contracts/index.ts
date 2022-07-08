import { WhitelistPolicy } from '~types/index';

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
