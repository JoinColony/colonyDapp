import { FormikProps } from 'formik';
import { useQuery } from '@apollo/react-hooks';
import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';

import { ROLES } from '~constants';
import { Address } from '~types/index';
import { mergePayload, withKey, mapPayload, pipe } from '~utils/actions';
import { ItemDataType } from '~core/OmniPicker';
import { ActionTypeString, ActionTypes } from '~redux/index';
import { useDataFetcher, useTransformer } from '~utils/hooks';
import {
  ColonySubscribedUsersDocument,
  AnyUser,
  useUserLazy,
} from '~data/index';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { SpinnerLoader } from '~core/Preloaders';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel } from '~core/Fields';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { TEMP_getUserRolesWithRecovery } from '../../../transformers';
import {
  domainsAndRolesFetcher,
  TEMP_userHasRecoveryRoleFetcher,
} from '../../../dashboard/fetchers';
import PermissionForm from './PermissionForm';

import styles from './ColonyPermissionsDialog.css';

const MSG = defineMessages({
  errorNoUserGiven: {
    id: 'admin.ColonyPermissionsAddDialog.errorNoUserGiven',
    defaultMessage: 'No user selected',
  },
  title: {
    id: 'admin.ColonyPermissionsAddDialog.title',
    defaultMessage: 'Add New Role in {domain}',
  },
  selectUser: {
    id: 'admin.ColonyPermissionsAddDialog.selectUser',
    defaultMessage: 'Select Member',
  },
  search: {
    id: 'admin.ColonyPermissionsAssDialog.search',
    defaultMessage: 'Search for a user or paste a wallet address',
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
  domainId: number;
  colonyAddress: Address;
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
  ROLES.ARBITRATION,
];

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: string, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" />
);

const ColonyPermissionsAddDialog = ({
  colonyAddress,
  cancel,
  close,
  domainId,
}: Props) => {
  const [selectedUserAddress, setSelectedUserAddress] = useState<string>();

  const { data: domains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const { data: colonyRecoveryRoles = [] } = useDataFetcher(
    TEMP_userHasRecoveryRoleFetcher,
    [colonyAddress],
    [colonyAddress, selectedUserAddress],
  );

  const roles = useTransformer(TEMP_getUserRolesWithRecovery, [
    domains,
    colonyRecoveryRoles,
    domainId,
    selectedUserAddress,
  ]);

  const updateSelectedUser = useCallback(
    (user: AnyUser) => {
      setSelectedUserAddress(user.profile.walletAddress);
    },
    [setSelectedUserAddress],
  );

  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload(p => ({
        userAddress: p.user.profile.walletAddress,
        domainId,
        colonyAddress,
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

  const { data: subscribedUsersData } = useQuery(
    ColonySubscribedUsersDocument,
    {
      variables: { colonyAddress },
    },
  );

  const user = useUserLazy(selectedUserAddress);

  return (
    <Dialog cancel={cancel}>
      {!domains ||
      !subscribedUsersData ||
      !subscribedUsersData.colony.subscribedUsers ? (
        <SpinnerLoader />
      ) : (
        <ActionForm
          enableReinitialize
          initialValues={{
            domainId,
            roles,
            user,
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
                  <SingleUserPicker
                    appearance={{ width: 'wide' }}
                    data={subscribedUsersData.colonySubscribedUsers}
                    name="user"
                    placeholder={MSG.search}
                    filter={filterUserSelection}
                    onSelected={updateSelectedUser}
                    renderAvatar={supRenderAvatar}
                  />
                </div>
                <PermissionForm
                  colonyRecoveryRoles={colonyRecoveryRoles}
                  domainId={domainId}
                  domains={domains}
                  userAddress={selectedUserAddress}
                  userRoles={roles}
                />
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
                    disabled={!selectedUserAddress}
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

ColonyPermissionsAddDialog.displayName =
  'admin.Permissions.ColonyPermissionsAddDialog';

export default ColonyPermissionsAddDialog;
