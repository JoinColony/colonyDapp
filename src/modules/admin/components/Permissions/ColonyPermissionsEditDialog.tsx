import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { Address } from '~types/index';
import { mergePayload, withKey, mapPayload, pipe } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { useTransformer } from '~utils/hooks';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';
import UserInfo from '~users/UserInfo';
import { useColonyQuery, useLoggedInUser, useUser } from '~data/index';

import {
  getUserRolesForDomain,
  getAllRootAccounts,
} from '../../../transformers';
import PermissionForm from './PermissionForm';
import { availableRoles } from './constants';

import styles from './ColonyPermissionsDialog.css';

const MSG = defineMessages({
  title: {
    id: 'admin.ColonyPermissionsEditDialog.title',
    defaultMessage: 'Edit user roles in {domain}',
  },
  selectUser: {
    id: 'admin.ColonyPermissionsEditDialog.selectUser',
    defaultMessage: 'Selected Member',
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
  domainId: number;
  colonyAddress: Address;
  userAddress: Address;
}

const ColonyPermissionsEditDialog = ({
  colonyAddress,
  cancel,
  close,
  domainId,
  userAddress,
}: Props) => {
  const { walletAddress } = useLoggedInUser();

  const user = useUser(userAddress);
  const { data: colonyData } = useColonyQuery({
    variables: { address: colonyAddress },
  });

  const currentUserRoles = useTransformer(getUserRolesForDomain, [
    colonyData && colonyData.colony,
    // CURRENT USER!
    walletAddress,
    domainId,
  ]);

  const userDirectRoles = useTransformer(getUserRolesForDomain, [
    colonyData && colonyData.colony,
    // USER TO SET PERMISSIONS FOR!
    userAddress,
    domainId,
    true,
  ]);

  const userInheritedRoles = useTransformer(getUserRolesForDomain, [
    colonyData && colonyData.colony,
    // USER TO SET PERMISSIONS FOR!
    userAddress,
    domainId,
  ]);

  const rootAccounts = useTransformer(getAllRootAccounts, [
    colonyData && colonyData.colony,
  ]);

  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload((p) => ({
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

  const domain =
    colonyData &&
    colonyData.colony.domains.find(
      ({ ethDomainId }) => ethDomainId === domainId,
    );

  return (
    <Dialog cancel={cancel}>
      {!userAddress || !colonyData || !domain ? (
        <SpinnerLoader />
      ) : (
        <ActionForm
          enableReinitialize
          initialValues={{
            domainId,
            roles: userDirectRoles,
            userAddress,
          }}
          onSuccess={close}
          submit={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET}
          error={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_ERROR}
          success={ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_SUCCESS}
          transform={transform}
        >
          {({ isSubmitting }: FormikProps<any>) => (
            <div className={styles.dialogContainer}>
              <Heading
                appearance={{ size: 'medium', margin: 'none' }}
                text={MSG.title}
                textValues={{ domain: domain && domain.name }}
              />
              <div className={styles.titleContainer}>
                <InputLabel label={MSG.selectUser} />
                <UserInfo
                  colonyAddress={colonyAddress}
                  userAddress={userAddress}
                  user={user}
                  placeholder={MSG.selectUser}
                >
                  {user && user.profile
                    ? user.profile.displayName || user.profile.username
                    : userAddress}
                </UserInfo>
              </div>
              <PermissionForm
                currentUserRoles={currentUserRoles}
                domainId={domainId}
                rootAccounts={rootAccounts}
                userDirectRoles={userDirectRoles}
                userInheritedRoles={userInheritedRoles}
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
                  type="submit"
                />
              </DialogSection>
            </div>
          )}
        </ActionForm>
      )}
    </Dialog>
  );
};

ColonyPermissionsEditDialog.displayName =
  'admin.Permissions.ColonyPermissionsEditDialog';

export default ColonyPermissionsEditDialog;
