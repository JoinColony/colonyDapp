import { useColonyReputationQuery } from '~data/index';
import { Address } from '~types/index';

export const useColonyReputation = (colonyAddress: Address) => {
  const { data, error } = useColonyReputationQuery({
    variables: {
      address: colonyAddress,
    },
  });

  return {
    colonyHasReputation: data?.colonyReputation !== '0' && !error,
  };
};
