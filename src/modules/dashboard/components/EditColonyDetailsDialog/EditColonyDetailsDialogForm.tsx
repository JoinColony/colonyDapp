import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { FormikProps } from 'formik';

import AvatarUploader from '~core/AvatarUploader';
import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations, Input } from '~core/Fields';
import { DefaultPlaceholder } from '~core/FileUpload';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import ColonyAvatar from '~core/ColonyAvatar';
import InputStatus from '~core/Fields/InputStatus';

import { useLoggedInUser, Colony } from '~data/index';
import { useTransformer } from '~utils/hooks';

import { getAllUserRoles } from '../../../transformers';
import { hasRoot } from '../../../users/checks';

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
    id:
      // eslint-disable-next-line max-len
      'dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.permittedFormat',
    defaultMessage:
      'Permitted format: .png or .svg (at least 250px, up to 200 Kb)',
  },
  annotation: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.annotation',
    defaultMessage: `Explain why you’re editing the colony's details (optional)`,
  },
  noPermission: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.noPermission',
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
  invalidAvatarFormat: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.EditColonyDetailsDialog.EditColonyDetailsDialogForm.invalidAvatarFormat',
    defaultMessage: `Image you tried to upload is in an invalid format`,
  },
});

const ColonyAvatarHooked = HookedColonyAvatar({ fetchColony: true });

interface Props {
  back: () => void;
  colony: Colony;
}

const EditColonyDetailsDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, avatarHash, avatarURL, displayName },
  handleSubmit,
  isSubmitting,
  isValid,
  values: { colonyAvatarImage, colonyDisplayName },
  setFieldValue,
}: Props & FormikProps<FormValues>) => {
  const [showUploadedAvatar, setShowUploadedAvatar] = useState(false);
  const [avatarFileError, setAvatarFileError] = useState(false);

  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;

  const userHasPermission = hasRegisteredProfile && hasRoot(allUserRoles);

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

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
        </DialogSection>
      )}
      <DialogSection>
        <AvatarUploader
          disabled={!userHasPermission}
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
                  disabled={!userHasPermission}
                />
              ) : (
                <DefaultPlaceholder disabled={!userHasPermission} />
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
          disabled={!userHasPermission}
          maxLength={20}
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={!userHasPermission}
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
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={{ id: 'button.confirm' }}
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={
            !userHasPermission ||
            !isValid ||
            avatarFileError ||
            !canValuesBeUpdate
          }
        />
      </DialogSection>
    </>
  );
};

export default EditColonyDetailsDialogForm;
