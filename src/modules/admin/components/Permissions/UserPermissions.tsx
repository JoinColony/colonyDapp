import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ROLES } from '~constants';
import { Address, DomainsMapType } from '~types/index';
import { useTransformer } from '~utils/hooks';

import { getUserRoles } from '../../../transformers';
import { ROLE_MESSAGES } from '../../constants';

import styles from './UserPermissions.css';

interface Props {
  userAddress: Address;
  domains: DomainsMapType;
  domainId: number;
}

const displayName = 'admin.Permissions.UserPermissions';

const UserPermissions = ({ userAddress, domains, domainId }: Props) => {
  const inheritedUserRoles = useTransformer(getUserRoles, [
    domains,
    domainId,
    userAddress,
  ]);

  const sortedRoles = inheritedUserRoles
    .filter(
      role =>
        // Don't display ARCHITECTURE_SUBDOMAIN in listed roles
        role !== ROLES.ARCHITECTURE_SUBDOMAIN,
    )
    .sort((a, b) => {
      if (a === ROLES.ROOT || b === ROLES.ROOT) {
        return a === ROLES.ROOT ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className={styles.main}>
      {/* @TODO restore pending role indicator */}
      {/* {userPermissions.pending ? ( */}
      {/*  <div className={styles.pendingDot} /> */}
      {sortedRoles.map(role => (
        <span className={styles.permission} key={role}>
          <FormattedMessage id={ROLE_MESSAGES[role]} />
        </span>
      ))}
    </div>
  );
};

UserPermissions.displayName = displayName;

export default UserPermissions;
