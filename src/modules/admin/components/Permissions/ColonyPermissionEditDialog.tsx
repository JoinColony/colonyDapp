import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ROLES, ROOT_DOMAIN } from '~constants';
import { Address } from '~types/index';
import { mergePayload, withKey, mapPayload, pipe } from '~utils/actions';
import { ActionTypeString, ActionTypes } from '~redux/index';
import { useSelector, useDataFetcher, useTransformer } from '~utils/hooks';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';
import { SpinnerLoader } from '~core/Preloaders';
import UserInfo from '~users/UserInfo';

import {
  getUserRoles,
  TEMP_getUserRolesWithRecovery,
} from '../../../transformers';
import { userFetcher } from '../../../users/fetchers';
import {
  domainsAndRolesFetcher,
  TEMP_userHasRecoveryRoleFetcher,
} from '../../../dashboard/fetchers';
import { walletAddressSelector } from '../../../users/selectors';
import PermissionCheckbox from './PermissionCheckbox';

import styles from './ColonyPermissionEditDialog.css';

const DOMAINS_HELP_URL =
  // eslint-disable-next-line max-len
  'https://help.colony.io/hc/en-us/articles/360024588993-What-are-the-permissions-in-a-colony-';

const MSG = defineMessages({
  title: {
    id: 'admin.ColonyPermissionEditDialog.title',
    defaultMessage: 'Add New Role in {domain}',
  },
  selectUser: {
    id: 'admin.ColonyPermissionEditDialog.selectUser',
    defaultMessage: 'Selected Member',
  },
  permissionsLabel: {
    id: 'admin.ColonyPermissionEditDialog.permissionsLabel',
    defaultMessage: 'Permissions',
  },
  search: {
    id: 'admin.ColonyPermissionEditDialog.search',
    defaultMessage: 'Search for a user or paste a wallet address',
  },
  permissionInParent: {
    id: 'admin.ColonyPermissionEditDialog.permissionInParent',
    defaultMessage: '*Permission granted via parent domain. {learnMore}',
  },
  learnMore: {
    id: 'admin.ColonyPermissionEditDialog.learnMore',
    defaultMessage: 'Learn more',
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
  domainId: number;
  colonyAddress: Address;
  userAddress: Address;
  submit: ActionTypeString;
  success: ActionTypeString;
  error: ActionTypeString;
}

const availableRoles: ROLES[] = [
  ROLES.ROOT,
  ROLES.ADMINISTRATION,
  ROLES.ARCHITECTURE,
  ROLES.FUNDING,
  ROLES.RECOVERY,
];

const ColonyPermissionEditDialog = ({
  colonyAddress,
  cancel,
  close,
  domainId,
  userAddress,
}: Props) => {
  const { data: user } = useDataFetcher(
    userFetcher,
    [userAddress],
    [userAddress],
  );

  // Get the current user's roles in the selected domain
  const currentUserAddress = useSelector(walletAddressSelector);

  const { data: domains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const { data: colonyRecoveryRoles = [] } = useDataFetcher(
    TEMP_userHasRecoveryRoleFetcher,
    [colonyAddress],
    [colonyAddress, userAddress],
  );

  const currentUserRoles = useTransformer(getUserRoles, [
    domains,
    domainId,
    currentUserAddress,
  ]);

  const userDirectRoles = useTransformer(TEMP_getUserRolesWithRecovery, [
    domains,
    colonyRecoveryRoles,
    domainId,
    userAddress,
    true,
  ]);

  const userInheritedRoles = useTransformer(TEMP_getUserRolesWithRecovery, [
    domains,
    colonyRecoveryRoles,
    ROOT_DOMAIN,
    userAddress,
  ]);

  // Check which roles the current user is allowed to set in this domain
  const canRoleBeSet = useCallback(
    (role: ROLES) => {
      switch (role) {
        // Can't set arbitration at all yet
        case ROLES.ARBITRATION:
          return false;

        // Can only be set by root and in root domain
        case ROLES.ROOT:
        case ROLES.RECOVERY:
          return (
            domainId === ROOT_DOMAIN && currentUserRoles.includes(ROLES.ROOT)
          );

        // Must be root for these
        case ROLES.ADMINISTRATION:
        case ROLES.FUNDING:
        case ROLES.ARCHITECTURE:
          return currentUserRoles.includes(ROLES.ROOT);

        default:
          return false;
      }
    },
    [currentUserRoles, domainId],
  );

  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload(p => ({
        ...p,
        roles: availableRoles.reduce(
          (acc, role) => ({
            ...acc,
            [role]: p.roles.includes(role),
          }),
          {},
        ),
      })),
      mergePayload({ colonyAddress }),
    ),
    [colonyAddress, domainId],
  );

  return (
    <Dialog cancel={cancel}>
      {!user || !domains ? (
        <SpinnerLoader />
      ) : (
        <ActionForm
          enableReinitialize
          initialValues={{
            domainId,
            roles: userInheritedRoles,
            userAddress,
          }}
          onSuccess={close}
          submit={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET}
          error={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_ERROR}
          success={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_SUCCESS}
          transform={transform}
        >
          {({ isSubmitting }: FormikProps<any>) => {
            const domain = domains[domainId];
            return (
              <div className={styles.dialogContainer}>
                <Heading
                  appearance={{ size: 'medium', margin: 'none' }}
                  text={MSG.title}
                  textValues={{ domain: domain && domain.name }}
                />
                <div className={styles.titleContainer}>
                  <InputLabel label={MSG.selectUser} />
                  <UserInfo
                    userAddress={userAddress}
                    user={user}
                    placeholder={MSG.placeholder}
                  >
                    {user.profile.displayName || user.profile.username}
                  </UserInfo>
                </div>
                <InputLabel label={MSG.permissionsLabel} />
                {availableRoles.map(role => {
                  const roleIsInherited =
                    !userDirectRoles.includes(role) &&
                    userInheritedRoles.includes(role);
                  return (
                    <div
                      key={role}
                      className={styles.permissionChoiceContainer}
                    >
                      <PermissionCheckbox
                        disabled={!canRoleBeSet(role) || roleIsInherited}
                        role={role}
                        asterisk={roleIsInherited}
                      />
                    </div>
                  );
                })}
                <p className={styles.parentPermissionTip}>
                  <FormattedMessage
                    {...MSG.permissionInParent}
                    values={{
                      learnMore: (
                        <ExternalLink
                          text={MSG.learnMore}
                          href={DOMAINS_HELP_URL}
                        />
                      ),
                    }}
                  />
                </p>
                <DialogSection appearance={{ align: 'right' }}>
                  <Button
                    appearance={{ theme: 'secondary', size: 'large' }}
                    onClick={cancel}
                    text={{ id: 'button.cancel' }}
                  />
                  <Button
                    appearance={{ theme: 'primary', size: 'large' }}
                    loading={isSubmitting}
                    text={{ id: 'button.confirm' }}
                    type="submit"
                  />
                </DialogSection>
              </div>
            );
          }}
        </ActionForm>
      )}
    </Dialog>
  );
};

ColonyPermissionEditDialog.displayName = 'admin.ColonyPermissionEditDialog';

export default ColonyPermissionEditDialog;
