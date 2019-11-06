import { FormikProps } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';

import { ROLES } from '~constants';
import { Address } from '~types/index';
import { mergePayload, withKey, mapPayload, pipe } from '~utils/actions';
import { UserType } from '~immutable/index';
import { ItemDataType } from '~core/OmniPicker';
import { ActionTypeString, ActionTypes } from '~redux/index';
import { useSelector, useDataFetcher, useTransformer } from '~utils/hooks';
import { filterUserSelection } from '~utils/arrays';

import SingleUserPicker from '~core/SingleUserPicker';
import { SpinnerLoader } from '~core/Preloaders';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel } from '~core/Fields';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { TEMP_getUserRolesWithRecovery } from '../../../transformers';
import { getUserPickerData } from '../../../users/transformers';
import {
  domainsAndRolesFetcher,
  TEMP_userHasRecoveryRoleFetcher,
} from '../../../dashboard/fetchers';
import { allUsersSelector } from '../../../users/selectors';
import PermissionForm from './PermissionForm';

import styles from './ColonyPermissionsDialog.css';

const MSG = defineMessages({
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

const supRenderAvatar = (address: string, item: ItemDataType<UserType>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...user } = item;
  return <UserAvatar address={address} user={user} size="xs" />;
};

const ColonyPermissionsAddDialog = ({
  colonyAddress,
  cancel,
  close,
  domainId,
}: Props) => {
  const [selectedUserAddress, setSelectedUserAddress] = useState<string | null>(
    null,
  );

  const allUsers = useSelector(allUsersSelector);

  const users = useTransformer(getUserPickerData, [allUsers]);

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
    (user: UserType) => {
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

  const user = useMemo(
    () =>
      selectedUserAddress
        ? users.find(({ id }) => id === selectedUserAddress)
        : null,
    [selectedUserAddress, users],
  );

  return (
    <Dialog cancel={cancel}>
      {!domains ? (
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
          {({ isSubmitting, isValid }: FormikProps<any>) => {
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
                    data={users}
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
                    disabled={!isValid}
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
