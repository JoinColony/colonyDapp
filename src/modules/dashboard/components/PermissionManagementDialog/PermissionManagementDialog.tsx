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
import { useTransformer, WizardDialogType } from '~utils/hooks';
import { ItemDataType } from '~core/OmniPicker';
import Heading from '~core/Heading';
import Button from '~core/Button';
import PermissionsLabel from '~core/PermissionsLabel';
import Dialog, {
  ActionDialogProps,
  DialogProps,
  DialogSection,
} from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import HookedUserAvatar from '~users/HookedUserAvatar';
import {
  useLoggedInUser,
  useColonySubscribedUsersQuery,
  useUser,
  AnyUser,
} from '~data/index';
import Toggle from '~core/Fields/Toggle';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';

import {
  getUserRolesForDomain,
  getAllRootAccounts,
  getAllUserRolesForDomain,
} from '../../../transformers';
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

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: string, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const PermissionManagementDialog = ({
  colony: { colonyAddress, colonyName, domains },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
  isVotingExtensionEnabled,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const history = useHistory();

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_MOTION_USER_ROLES_SET${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_USER_ROLES_SET${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );
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

  const currentUserRoles = useTransformer(getUserRolesForDomain, [
    colony,
    // CURRENT USER!
    loggedInUserWalletAddress,
    selectedDomainId,
  ]);

  const currentUserRolesInRoot = useTransformer(getUserRolesForDomain, [
    colony,
    loggedInUserWalletAddress,
    ROOT_DOMAIN_ID,
  ]);

  const userDirectRoles = useTransformer(getUserRolesForDomain, [
    colony,
    // USER TO SET PERMISSIONS FOR!
    selectedUser.profile.walletAddress,
    selectedDomainId,
    true,
  ]);

  const userInheritedRoles = useTransformer(getUserRolesForDomain, [
    colony,
    // USER TO SET PERMISSIONS FOR!
    selectedUser.profile.walletAddress,
    selectedDomainId,
  ]);

  const domainRoles = useTransformer(getAllUserRolesForDomain, [
    colony,
    selectedDomainId,
  ]);

  const directDomainRoles = useTransformer(getAllUserRolesForDomain, [
    colony,
    selectedDomainId,
    true,
  ]);

  const rootAccounts = useTransformer(getAllRootAccounts, [colony]);

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
        colonyName,
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

  const domain = domains?.find(
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

  const canEditPermissions =
    (selectedDomainId === ROOT_DOMAIN_ID &&
      currentUserRolesInRoot.includes(ColonyRole.Root)) ||
    currentUserRolesInRoot.includes(ColonyRole.Architecture);
  const requiredRoles: ColonyRole[] = [ColonyRole.Architecture];

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canEditPermissions,
    isVotingExtensionEnabled,
    isForce,
  );

  const inputDisabled = !userHasPermission || onlyForceAction;

  return (
    <Dialog cancel={cancel}>
      {!selectedUser.profile.walletAddress || !colony || !domain ? (
        <SpinnerLoader />
      ) : (
        <ActionForm
          enableReinitialize
          initialValues={{
            forceAction: false,
            user: selectedUser,
            domainId: selectedDomainId.toString(),
            roles: userDirectRoles,
            annotationMessage: undefined,
          }}
          validationSchema={validationSchema}
          onSuccess={close}
          submit={getFormAction('SUBMIT')}
          error={getFormAction('ERROR')}
          success={getFormAction('SUCCESS')}
          transform={transform}
        >
          {({
            isSubmitting,
            isValid,
            initialValues,
            values,
          }: FormikProps<any>) => {
            if (values.forceAction !== isForce) {
              setIsForce(values.forceAction);
            }
            return (
              <div className={styles.dialogContainer}>
                <DialogSection appearance={{ theme: 'heading' }}>
                  <Heading
                    appearance={{
                      size: 'medium',
                      margin: 'none',
                      theme: 'dark',
                    }}
                    text={MSG.title}
                    textValues={{ domain: domain && domain.name }}
                  />
                  {canEditPermissions && isVotingExtensionEnabled && (
                    <Toggle label={{ id: 'label.force' }} name="forceAction" />
                  )}
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
                      disabled={inputDisabled}
                    />
                  </div>
                </DialogSection>
                <DialogSection appearance={{ theme: 'sidePadding' }}>
                  <PermissionManagementForm
                    currentUserRoles={currentUserRoles}
                    domainId={selectedDomainId}
                    rootAccounts={rootAccounts}
                    userDirectRoles={userDirectRoles}
                    currentUserRolesInRoot={currentUserRolesInRoot}
                    userInheritedRoles={userInheritedRoles}
                    colonyDomains={domains}
                    onDomainSelected={setSelectedDomainId}
                    inputDisabled={inputDisabled}
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
                {onlyForceAction && <NotEnoughReputation />}
                <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
                  <Button
                    appearance={{ theme: 'secondary', size: 'large' }}
                    onClick={
                      prevStep === undefined || callStep === undefined
                        ? cancel
                        : () => callStep(prevStep)
                    }
                    text={{
                      id:
                        prevStep === undefined || callStep === undefined
                          ? 'button.cancel'
                          : 'button.back',
                    }}
                  />
                  <Button
                    appearance={{ theme: 'primary', size: 'large' }}
                    loading={isSubmitting}
                    text={{ id: 'button.confirm' }}
                    type="submit"
                    style={{ width: styles.wideButton }}
                    disabled={
                      inputDisabled ||
                      !isValid ||
                      isEqual(sortBy(values.roles), sortBy(initialValues.roles))
                    }
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

PermissionManagementDialog.displayName = displayName;

export default PermissionManagementDialog;
