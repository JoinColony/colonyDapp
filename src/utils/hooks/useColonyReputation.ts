import { useColonyReputationQuery } from '~data/index';
import { Address } from '~types/index';

export const useColonyReputation = (
  colonyAddress: Address,
  domainId?: number,
) => {
  const { data, error } = useColonyReputationQuery({
    variables: {
      address: colonyAddress,
      domainId,
    },
  });

  return data?.colonyReputation !== '0' && !error;
};
