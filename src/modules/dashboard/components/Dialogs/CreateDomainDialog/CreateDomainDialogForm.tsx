import React, { useState } from 'react';
import {
  ColonyRole,
  VotingReputationExtensionVersion,
} from '@colony/colony-js';
import { FormikProps } from 'formik';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import ColorSelect from '~core/ColorSelect';
import { Color } from '~core/ColorTag';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Input, Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import ForceToggle from '~core/Fields/ForceToggle';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { getAllUserRoles } from '~modules/transformers';
import { canArchitect } from '~modules/users/checks';

import { FormValues } from './CreateDomainDialog';
import styles from './CreateDomainDialogForm.css';

const MSG = defineMessages({
  titleCreate: {
    id: 'dashboard.CreateDomainDialog.CreateDomainDialogForm.titleCreate',
    defaultMessage: 'Create a new team',
  },
  name: {
    id: 'dashboard.CreateDomainDialog.CreateDomainDialogForm.name',
    defaultMessage: 'Team name',
  },
  purpose: {
    id: 'dashboard.CreateDomainDialog.CreateDomainDialogForm.name',
    defaultMessage: 'What is the purpose of this team?',
  },
  annotation: {
    id: 'dashboard.CreateDomainDialog.CreateDomainDialogForm.annotation',
    defaultMessage: 'Explain why you’re creating this team (optional)',
  },
  noPermission: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.CreateDomainDialog.CreateDomainDialogForm.noPermission',
    defaultMessage:
      // eslint-disable-next-line max-len
      'You need the {roleRequired} permission in {domain} to take this action.',
  },
  cannotCreateMotion: {
    id: `dashboard.CreateDomainDialog.CreateDomainDialogForm.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  isSubmitting;
  isValid;
}

const CreateDomainDialogForm = ({
  back,
  colony,
  handleSubmit,
  isSubmitting,
  isValid,
  values,
}: Props & FormikProps<FormValues>) => {
  const [domainColor, setDomainColor] = useState(Color.LightPink);

  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canCreateDomain = hasRegisteredProfile && canArchitect(allUserRoles);

  const {
    votingExtensionVersion,
    isVotingExtensionEnabled,
  } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canCreateDomain,
    isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  const cannotCreateMotion =
    votingExtensionVersion ===
      VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
    !values.forceAction;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          {isVotingExtensionEnabled && (
            <div className={styles.motionVoteDomain}>
              <MotionDomainSelect
                colony={colony}
                /*
                 * @NOTE Always disabled since you can only create this motion in root
                 */
                disabled
              />
            </div>
          )}
          <div className={styles.headingContainer}>
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.titleCreate}
            />
            {canCreateDomain && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
            )}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Architecture]} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.nameAndColorContainer}>
          <div className={styles.domainName}>
            <Input
              label={MSG.name}
              name="teamName"
              appearance={{ colorSchema: 'grey', theme: 'fat' }}
              disabled={inputDisabled}
              maxLength={20}
              dataTest="domainNameInput"
            />
          </div>
          <ColorSelect
            activeOption={domainColor}
            appearance={{ alignOptions: 'right' }}
            onColorChange={setDomainColor}
            disabled={inputDisabled}
            name="domainColor"
          />
        </div>
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.purpose}
          name="domainPurpose"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={inputDisabled}
          maxLength={90}
          dataTest="domainPurposeInput"
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={inputDisabled}
          dataTest="createDomainAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Architecture}
                    name={{ id: `role.${ColonyRole.Architecture}` }}
                  />
                ),
                domain: 'Root',
              }}
            />
          </div>
        </DialogSection>
      )}
      {onlyForceAction && (
        <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
      )}
      {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.cannotCreateMotion}
              values={{
                version:
                  VotingReputationExtensionVersion.FuchsiaLightweightSpaceship,
              }}
            />
          </div>
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        {back && (
          <Button
            text={{ id: 'button.back' }}
            onClick={back}
            appearance={{ theme: 'secondary', size: 'large' }}
          />
        )}
        <Button
          text={
            values.forceAction || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={cannotCreateMotion || inputDisabled || !isValid}
          style={{ minWidth: styles.wideButton }}
          data-test="createDomainConfirmButton"
        />
      </DialogSection>
    </>
  );
};

export default CreateDomainDialogForm;
