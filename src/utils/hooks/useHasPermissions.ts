import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { useLoggedInUser } from '~data/helpers';
import { Colony } from '~data/index';
import { getUserRolesForDomain } from '~modules/transformers';
import { userHasRole } from '~modules/users/checks';
import { useTransformer } from '.';

export const useHasPermission = (colony: Colony, permission: number) => {
  const { walletAddress } = useLoggedInUser();
  const fromDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);
  return userHasRole(fromDomainRoles, permission);
};
