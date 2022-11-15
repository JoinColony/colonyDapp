import { FundingSource } from '~dashboard/ExpenditurePage/Streaming/types';

export const checkIfEnoughFunds = (fundingSources?: FundingSource[]) => {
  // This function is a mock.
  // Add a logic to check if there are enough funds
  if (!fundingSources) {
    return undefined;
  }

  return {
    fundingSources: [fundingSources[0].id],
    tokens: fundingSources[0].rates.map((rate) => rate.token),
  };
};
