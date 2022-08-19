import { FormikProps } from 'formik';
import React, { useCallback, useState } from 'react';
import * as yup from 'yup';
import { defineMessages, FormattedMessage } from 'react-intl';
import {
  ROOT_DOMAIN_ID,
  ColonyRole,
  VotingReputationExtensionVersion,
} from '@colony/colony-js';
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
import Button from '~core/Button';
import PermissionsLabel from '~core/PermissionsLabel';
import Dialog, {
  ActionDialogProps,
  DialogProps,
  DialogSection,
} from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';
import { useLoggedInUser, useUser, AnyUser } from '~data/index';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import {
  getUserRolesForDomain,
  getAllRootAccounts,
} from '~modules/transformers';
import { Address } from '~types/index';

import { availableRoles } from './constants';
import PermissionManagementForm from './PermissionManagementForm';

import styles from './PermissionManagementDialog.css';

const validationSchema = yup.object().shape({
  domainId: yup.number().required(),
  user: yup.object().shape({
    profile: yup.object().shape({
      walletAddress: yup.string().address().required(),
    }),
  }),
  roles: yup.array().ensure(),
  annotation: yup.string().max(4000),
  forceAction: yup.boolean(),
  motionDomainId: yup.number(),
});

const displayName = 'dashboard.PermissionManagementDialog';

const MSG = defineMessages({
  noPermissionFrom: {
    id: 'dashboard.PermissionManagementDialog.noPermissionFrom',
    defaultMessage: `You do not have the {roleRequired} permission required to take this action.`,
  },
});

export interface FormValues {
  domainId: string;
  user: Address;
  roles: string[];
  annotation: string;
  forceAction: boolean;
  motionDomainId: string;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps & {
    ethDomainId?: number;
  };

const PermissionManagementDialog = ({
  colony: { colonyAddress, colonyName, domains },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
  ethDomainId: preselectedDomainId,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const history = useHistory();

  const {
    isVotingExtensionEnabled,
    votingExtensionVersion,
  } = useEnabledExtensions({
    colonyAddress,
  });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`MOTION_USER_ROLES_SET${actionEnd}`]
        : ActionTypes[`ACTION_USER_ROLES_SET${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );
  const { walletAddress: loggedInUserWalletAddress } = useLoggedInUser();

  const loggedInUser = useUser(loggedInUserWalletAddress);

  const [selectedUser, setSelectedUser] = useState<AnyUser>(loggedInUser);

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    preselectedDomainId === 0 || preselectedDomainId === undefined
      ? ROOT_DOMAIN_ID
      : preselectedDomainId,
  );
  const [selectedMotionDomainId, setSelectedMoitonDomainId] = useState<number>(
    selectedDomainId,
  );

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

  const rootAccounts = useTransformer(getAllRootAccounts, [colony]);

  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload(
        ({ roles, user, domainId, annotationMessage, motionDomainId }) => ({
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
          motionDomainId: parseInt(motionDomainId, 10),
        }),
      ),
      mergePayload({
        colonyAddress,
        colonyName,
      }),
      withMeta({ history }),
    ),
    [colonyAddress, selectedDomainId],
  );

  const domain = domains?.find(
    ({ ethDomainId }) => ethDomainId === selectedDomainId,
  );

  const canEditPermissions =
    (selectedDomainId === ROOT_DOMAIN_ID &&
      currentUserRolesInRoot.includes(ColonyRole.Root)) ||
    currentUserRolesInRoot.includes(ColonyRole.Architecture);

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canEditPermissions,
    isVotingExtensionEnabled,
    isForce,
    Number(selectedDomainId),
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
            roles: [...new Set([...userDirectRoles, ...userInheritedRoles])],
            annotationMessage: undefined,
            motionDomainId: selectedMotionDomainId.toString(),
          }}
          validationSchema={validationSchema}
          onSuccess={close}
          submit={getFormAction('SUBMIT')}
          error={getFormAction('ERROR')}
          success={getFormAction('SUCCESS')}
          transform={transform}
        >
          {(formValues: FormikProps<FormValues>) => {
            const { values, isSubmitting, isValid, initialValues } = formValues;
            if (values.forceAction !== isForce) {
              setIsForce(values.forceAction);
            }
            return (
              <div className={styles.dialogContainer}>
                <PermissionManagementForm
                  {...formValues}
                  colony={colony}
                  currentUserRoles={currentUserRoles}
                  domainId={selectedDomainId}
                  rootAccounts={rootAccounts}
                  userDirectRoles={userDirectRoles}
                  currentUserRolesInRoot={currentUserRolesInRoot}
                  userInheritedRoles={userInheritedRoles}
                  onDomainSelected={setSelectedDomainId}
                  onMotionDomainChange={setSelectedMoitonDomainId}
                  onChangeSelectedUser={setSelectedUser}
                  inputDisabled={inputDisabled || isSubmitting}
                  isSubmitting={isSubmitting}
                  userHasPermission={userHasPermission}
                />
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
                {onlyForceAction && (
                  <NotEnoughReputation domainId={Number(values.domainId)} />
                )}
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
                    text={
                      values.forceAction || !isVotingExtensionEnabled
                        ? { id: 'button.confirm' }
                        : { id: 'button.createMotion' }
                    }
                    type="submit"
                    style={{ minWidth: styles.wideButton }}
                    disabled={
                      (votingExtensionVersion ===
                        // eslint-disable-next-line max-len
                        VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
                        !values.forceAction) ||
                      inputDisabled ||
                      !isValid ||
                      isEqual(
                        sortBy(values.roles),
                        sortBy(initialValues.roles),
                      ) ||
                      isSubmitting
                    }
                    data-test="permissionConfirmButton"
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
