import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import {
  ColonyRole,
  VotingReputationExtensionVersion,
} from '@colony/colony-js';
import { FormikProps } from 'formik';

import AvatarUploader from '~core/AvatarUploader';
import Button from '~core/Button';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations, Input } from '~core/Fields';
import { DefaultPlaceholder } from '~core/FileUpload';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import ColonyAvatar from '~core/ColonyAvatar';
import InputStatus from '~core/Fields/InputStatus';
import ForceToggle from '~core/Fields/ForceToggle';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';

import { FormValues } from './EditColonyDetailsDialog';
import styles from './EditColonyDetailsDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.title',
    defaultMessage: 'Edit colony details',
  },
  name: {
    id: 'dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.name',
    defaultMessage: 'Colony name',
  },
  logo: {
    id: 'dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.logo',
    defaultMessage: 'Colony Logo (Optional)',
  },
  permittedFormat: {
    id: `dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.permittedFormat`,
    defaultMessage:
      'Permitted format: .png or .svg (at least 250px, up to 1 MB)',
  },
  annotation: {
    id: `dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.annotation`,
    defaultMessage: `Explain why you’re editing the colony's details (optional)`,
  },
  noPermission: {
    id: `dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.noPermission`,
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
  invalidAvatarFormat: {
    id: `dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.invalidAvatarFormat`,
    defaultMessage: `Image you tried to upload is in an invalid format`,
  },
  cannotCreateMotion: {
    id: `dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

const ColonyAvatarHooked = HookedColonyAvatar({ fetchColony: true });

const EditColonyDetailsDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, avatarHash, avatarURL, displayName },
  handleSubmit,
  isSubmitting,
  isValid,
  values: { colonyAvatarImage, colonyDisplayName, forceAction },
  setFieldValue,
}: ActionDialogProps & FormikProps<FormValues>) => {
  const [showUploadedAvatar, setShowUploadedAvatar] = useState(false);
  const [avatarFileError, setAvatarFileError] = useState(false);

  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canEdit = hasRegisteredProfile && hasRoot(allUserRoles);

  const {
    votingExtensionVersion,
    isVotingExtensionEnabled,
  } = useEnabledExtensions({
    colonyAddress,
  });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canEdit,
    isVotingExtensionEnabled,
    forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  /*
   * Note that these threee methods just read the file locally, they don't actually
   * upload it anywere.
   *
   * The upload method returns the file as a base64 string, which, after we submit
   * the form we will be uploading to IPFS
   */
  const handleFileRead = async (file) => {
    if (file) {
      const base64image = file.data;
      setFieldValue('colonyAvatarImage', String(base64image));
      setShowUploadedAvatar(true);
      return String(base64image);
    }
    return '';
  };

  const handleFileRemove = async () => {
    setFieldValue('colonyAvatarImage', null);
    setShowUploadedAvatar(true);
  };

  /*
   * This helps us hook into the internal file uplaoder error state,
   * so that we can invalidate the form if the uploaded file format is incorrect
   */
  const handleFileReadError = async () => {
    setAvatarFileError(true);
  };

  const canValuesBeUpdate =
    /*
     * If the newly set name is different from the existing one
     */
    displayName !== colonyDisplayName ||
    /*
     * If the newly set image is differnet from the existing one but only if
     * - it's a truthy (default form value)
     * - it's not null (it has been specifically removed by the user)
     */
    ((!!colonyAvatarImage || colonyAvatarImage === null) &&
      avatarURL !== colonyAvatarImage);

  const cannotCreateMotion =
    votingExtensionVersion ===
      VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
    !forceAction;

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
              text={MSG.title}
            />
            {canEdit && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
            )}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
        </DialogSection>
      )}
      <DialogSection>
        <AvatarUploader
          disabled={inputDisabled}
          hasButtons={false}
          label={MSG.logo}
          upload={handleFileRead}
          remove={handleFileRemove}
          labelAppearance={{ colorSchema: 'grey' }}
          placeholder={
            <>
              {showUploadedAvatar ? (
                /*
                 * If we have a currently uploaded avatar, **or** if we just remove it
                 * show the default colony avatar, without values coming from the
                 * colony.
                 *
                 * Note that in case of the avatar being removed, `avatarURL` will be
                 * passed as `undefined` so that the blockies show.
                 * This is intended functionality
                 */
                <ColonyAvatar
                  colonyAddress={colonyAddress}
                  avatarURL={colonyAvatarImage}
                  size="s"
                />
              ) : (
                /*
                 * Show the colony hooked avatar. This is only visible until the
                 * user interacts with avatar input for the first time
                 */
                <ColonyAvatarHooked
                  colony={colony}
                  colonyAddress={colonyAddress}
                  size="s"
                />
              )}
              {(!showUploadedAvatar && avatarHash) || colonyAvatarImage ? (
                <Button
                  appearance={{ theme: 'blue' }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleFileRemove();
                  }}
                  text={{ id: 'button.remove' }}
                  disabled={inputDisabled}
                />
              ) : (
                <DefaultPlaceholder disabled={inputDisabled} />
              )}
            </>
          }
          handleError={handleFileReadError}
        />
        {avatarFileError && (
          <div className={styles.avatarUploadError}>
            <InputStatus error={MSG.invalidAvatarFormat} />
          </div>
        )}
        <p className={styles.smallText}>
          <FormattedMessage {...MSG.permittedFormat} />
        </p>
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.name}
          name="colonyDisplayName"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={inputDisabled}
          maxLength={20}
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={inputDisabled}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <div className={styles.noPermissionMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Root}
                    name={{
                      id: `role.${ColonyRole.Root}`,
                    }}
                  />
                ),
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
          <div className={styles.cannotCreateMotion}>
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
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={
            forceAction || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={
            cannotCreateMotion ||
            inputDisabled ||
            !isValid ||
            avatarFileError ||
            !canValuesBeUpdate ||
            isSubmitting
          }
          style={{ minWidth: styles.wideButton }}
          data-test="confirmButton"
        />
      </DialogSection>
    </>
  );
};

export default EditColonyDetailsDialogForm;
