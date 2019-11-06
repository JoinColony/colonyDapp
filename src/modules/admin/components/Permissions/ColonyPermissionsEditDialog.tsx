import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { ROOT_DOMAIN } from '~constants';
import { Address } from '~types/index';
import { mergePayload, withKey, mapPayload, pipe } from '~utils/actions';
import { ActionTypeString, ActionTypes } from '~redux/index';
import { useDataFetcher, useTransformer } from '~utils/hooks';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Dialog, { DialogSection } from '~core/Dialog';
import { ActionForm, InputLabel } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';
import UserInfo from '~users/UserInfo';

import { TEMP_getUserRolesWithRecovery } from '../../../transformers';
import { userFetcher } from '../../../users/fetchers';
import {
  domainsAndRolesFetcher,
  TEMP_userHasRecoveryRoleFetcher,
} from '../../../dashboard/fetchers';
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
  submit: ActionTypeString;
  success: ActionTypeString;
  error: ActionTypeString;
}

const ColonyPermissionsEditDialog = ({
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

  const userRoles = useTransformer(TEMP_getUserRolesWithRecovery, [
    domains,
    colonyRecoveryRoles,
    ROOT_DOMAIN,
    userAddress,
  ]);

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
            roles: userRoles,
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
                <PermissionForm
                  colonyRecoveryRoles={colonyRecoveryRoles}
                  domainId={domainId}
                  domains={domains}
                  userAddress={userAddress}
                  userRoles={userRoles}
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
            );
          }}
        </ActionForm>
      )}
    </Dialog>
  );
};

ColonyPermissionsEditDialog.displayName =
  'admin.Permissions.ColonyPermissionsEditDialog';

export default ColonyPermissionsEditDialog;
