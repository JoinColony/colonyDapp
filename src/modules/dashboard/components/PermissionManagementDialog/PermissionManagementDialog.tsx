import { FormikProps } from 'formik';
import React, { useCallback, useState, useMemo } from 'react';
import * as yup from 'yup';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ROOT_DOMAIN_ID, ColonyRole } from '@colony/colony-js';
import { useHistory } from 'react-router-dom';
import { isEqual, sortBy } from 'lodash';

import {
  mergePayload,
  withKey,
  mapPayload,
  pipe,
  withMeta,
} from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { useTransformer } from '~utils/hooks';
import { ItemDataType } from '~core/OmniPicker';
import Heading from '~core/Heading';
import Button from '~core/Button';
import PermissionsLabel from '~core/PermissionsLabel';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import HookedUserAvatar from '~users/HookedUserAvatar';
import {
  useProcessedColonyQuery,
  useLoggedInUser,
  useColonySubscribedUsersQuery,
  useUser,
  AnyUser,
} from '~data/index';

import {
  getUserRolesForDomain,
  getAllRootAccounts,
  getAllUserRolesForDomain,
} from '../../../transformers';
import { userHasRole } from '../../../users/checks';
import PermissionManagementForm from './PermissionManagementForm';
import { availableRoles } from './constants';

import styles from './PermissionManagementDialog.css';

const displayName = 'dashboard.PermissionManagementDialog';

const MSG = defineMessages({
  title: {
    id: 'dashboard.PermissionManagementDialog.title',
    defaultMessage: 'Permissions',
  },
  selectUser: {
    id: 'dashboard.PermissionManagementDialog.selectUser',
    defaultMessage: 'Member',
  },
  noPermissionFrom: {
    id: 'dashboard.PermissionManagementDialog.noPermissionFrom',
    defaultMessage: `You do not have the {roleRequired} permission required to take this action.`,
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
  colonyAddress: string;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: string, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const PermissionManagementDialog = ({
  colonyAddress,
  cancel,
  close,
}: Props) => {
  const history = useHistory();
  const { walletAddress: loggedInUserWalletAddress } = useLoggedInUser();

  const loggedInUser = useUser(loggedInUserWalletAddress);

  const [selectedUser, setSelectedUser] = useState<AnyUser>(loggedInUser);

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    ROOT_DOMAIN_ID,
  );

  const { data: colonySubscribedUsers } = useColonySubscribedUsersQuery({
    variables: {
      colonyAddress,
    },
  });

  const subscribedUsers = colonySubscribedUsers?.subscribedUsers || [];

  const { data: colonyData } = useProcessedColonyQuery({
    variables: { address: colonyAddress },
  });

  const currentUserRoles = useTransformer(getUserRolesForDomain, [
    colonyData?.processedColony,
    // CURRENT USER!
    loggedInUserWalletAddress,
    selectedDomainId,
  ]);

  const userDirectRoles = useTransformer(getUserRolesForDomain, [
    colonyData?.processedColony,
    // USER TO SET PERMISSIONS FOR!
    selectedUser.profile.walletAddress,
    selectedDomainId,
    true,
  ]);

  const userInheritedRoles = useTransformer(getUserRolesForDomain, [
    colonyData?.processedColony,
    // USER TO SET PERMISSIONS FOR!
    selectedUser.profile.walletAddress,
    selectedDomainId,
  ]);

  const domainRoles = useTransformer(getAllUserRolesForDomain, [
    colonyData?.processedColony,
    selectedDomainId,
  ]);

  const directDomainRoles = useTransformer(getAllUserRolesForDomain, [
    colonyData?.processedColony,
    selectedDomainId,
    true,
  ]);

  const rootAccounts = useTransformer(getAllRootAccounts, [
    colonyData?.processedColony,
  ]);

  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload(({ roles, user, domainId, annotationMessage }) => ({
        domainId,
        userAddress: user.profile.walletAddress,
        roles: availableRoles.reduce(
          (acc, role) => ({
            ...acc,
            [role]: roles.includes(role),
          }),
          {},
        ),
        annotationMessage,
      })),
      mergePayload({
        colonyAddress,
        colonyName: colonyData?.processedColony.colonyName,
      }),
      withMeta({ history }),
    ),
    [colonyAddress, selectedDomainId],
  );

  const domainRolesArray = useMemo(
    () =>
      domainRoles
        .sort(({ roles }) => (roles.includes(ColonyRole.Root) ? -1 : 1))
        .filter(({ roles }) => !!roles.length)
        .map(({ address, roles }) => {
          const directUserRoles = directDomainRoles.find(
            ({ address: userAddress }) => userAddress === address,
          );
          return {
            userAddress: address,
            roles,
            directRoles: directUserRoles ? directUserRoles.roles : [],
          };
        }),
    [directDomainRoles, domainRoles],
  );

  const validationSchema = yup.object().shape({
    domainId: yup.number().required(),
    user: yup.object().required(),
    roles: yup.array().ensure(),
    annotation: yup.string().max(4000),
  });

  const domain =
    colonyData &&
    colonyData.processedColony.domains.find(
      ({ ethDomainId }) => ethDomainId === selectedDomainId,
    );

  const members = subscribedUsers.map((user) => {
    const {
      profile: { walletAddress },
    } = user;
    const domainRole = domainRolesArray.find(
      (rolesObject) => rolesObject.userAddress === walletAddress,
    );
    return {
      ...user,
      roles: domainRole ? domainRole.roles : [],
      directRoles: domainRole ? domainRole.directRoles : [],
    };
  });

  const userHasPermission = userHasRole(
    currentUserRoles,
    ColonyRole.Architecture,
  );
  const requiredRoles: ColonyRole[] = [ColonyRole.Architecture];

  return (
    <Dialog cancel={cancel}>
      {!selectedUser.profile.walletAddress || !colonyData || !domain ? (
        <SpinnerLoader />
      ) : (
        <ActionForm
          enableReinitialize
          initialValues={{
            user: selectedUser,
            domainId: selectedDomainId.toString(),
            roles: userDirectRoles,
            annotationMessage: undefined,
          }}
          validationSchema={validationSchema}
          onSuccess={close}
          submit={ActionTypes.COLONY_ACTION_USER_ROLES_SET}
          error={ActionTypes.COLONY_ACTION_USER_ROLES_SET_ERROR}
          success={ActionTypes.COLONY_ACTION_USER_ROLES_SET_SUCCESS}
          transform={transform}
        >
          {({
            isSubmitting,
            isValid,
            initialValues,
            values,
          }: FormikProps<any>) => (
            <div className={styles.dialogContainer}>
              <DialogSection appearance={{ theme: 'heading' }}>
                <Heading
                  appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
                  text={MSG.title}
                  textValues={{ domain: domain && domain.name }}
                />
              </DialogSection>
              {!userHasPermission && (
                <DialogSection>
                  <PermissionRequiredInfo requiredRoles={requiredRoles} />
                </DialogSection>
              )}
              <DialogSection appearance={{ theme: 'sidePadding' }}>
                <div className={styles.singleUserContainer}>
                  <SingleUserPicker
                    data={members}
                    label={MSG.selectUser}
                    name="user"
                    filter={filterUserSelection}
                    onSelected={setSelectedUser}
                    renderAvatar={supRenderAvatar}
                    disabled={!userHasPermission}
                  />
                </div>
              </DialogSection>
              <DialogSection appearance={{ theme: 'sidePadding' }}>
                <PermissionManagementForm
                  currentUserRoles={currentUserRoles}
                  domainId={selectedDomainId}
                  rootAccounts={rootAccounts}
                  userDirectRoles={userDirectRoles}
                  userInheritedRoles={userInheritedRoles}
                  colonyDomains={colonyData.processedColony.domains}
                  onDomainSelected={setSelectedDomainId}
                  userHasPermission={userHasPermission}
                />
              </DialogSection>
              {!userHasPermission && (
                <DialogSection appearance={{ theme: 'sidePadding' }}>
                  <div className={styles.noPermissionFromMessage}>
                    <FormattedMessage
                      {...MSG.noPermissionFrom}
                      values={{
                        roleRequired: (
                          <PermissionsLabel
                            permission={ColonyRole.Architecture}
                            name={{ id: `role.${ColonyRole.Architecture}` }}
                          />
                        ),
                      }}
                    />
                  </div>
                </DialogSection>
              )}
              <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
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
                  style={{ width: styles.wideButton }}
                  disabled={
                    !userHasPermission ||
                    !isValid ||
                    isEqual(sortBy(values.roles), sortBy(initialValues.roles))
                  }
                />
              </DialogSection>
            </div>
          )}
        </ActionForm>
      )}
    </Dialog>
  );
};

PermissionManagementDialog.displayName = displayName;

export default PermissionManagementDialog;
