import { ROOT_DOMAIN } from '~constants';
import { Address } from '~types/index';
import { useDataFetcher, useTransformer } from '~utils/hooks';

import { domainsAndRolesFetcher } from '../fetchers';
import { getUserRoles } from '../../transformers';

export const useUserRolesInDomain = (
  walletAddress: Address,
  colonyAddress: Address | undefined,
  domainId: number = ROOT_DOMAIN,
) => {
  const { data: domainsAndRolesData } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const userRoles = useTransformer(getUserRoles, [
    domainsAndRolesData,
    domainId || ROOT_DOMAIN,
    walletAddress,
  ]);
  return userRoles;
};
