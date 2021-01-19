import React, { useCallback } from 'react';
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

import { useLoggedInUser, Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { pipe, withKey, mergePayload } from '~utils/actions';
import { useAsyncFunction, useTransformer } from '~utils/hooks';

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
      'Permitted format: .png or .svg (at least 250px, up to 1MB)',
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
});

const ColonyAvatar = HookedColonyAvatar({ fetchColony: true });

interface Props {
  back: () => void;
  colony: Colony;
}

const uploadActions = {
  submit: ActionTypes.COLONY_AVATAR_UPLOAD,
  success: ActionTypes.COLONY_AVATAR_UPLOAD_SUCCESS,
  error: ActionTypes.COLONY_AVATAR_UPLOAD_ERROR,
};

const removeActions = {
  submit: ActionTypes.COLONY_AVATAR_REMOVE,
  success: ActionTypes.COLONY_AVATAR_REMOVE_SUCCESS,
  error: ActionTypes.COLONY_AVATAR_REMOVE_ERROR,
};

const EditColonyDetailsDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, avatarHash },
  handleSubmit,
  isSubmitting,
  isValid,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;

  const userHasPermission = hasRegisteredProfile && hasRoot(allUserRoles);

  const transform = useCallback(
    pipe(withKey(colonyAddress), mergePayload({ colonyAddress })),
    [colonyAddress],
  );

  const upload = useAsyncFunction({ ...uploadActions, transform }) as any;
  const remove = useAsyncFunction({ ...removeActions, transform }) as any;

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
          upload={upload}
          remove={remove}
          labelAppearance={{ colorSchema: 'grey' }}
          placeholder={
            <>
              <ColonyAvatar
                colony={colony}
                colonyAddress={colonyAddress}
                size="s"
              />
              {avatarHash !== null ? (
                <Button
                  appearance={{ theme: 'blue' }}
                  onClick={(event) => {
                    event.stopPropagation();
                    remove();
                  }}
                  text={{ id: 'button.remove' }}
                  disabled={!userHasPermission}
                />
              ) : (
                <DefaultPlaceholder disabled={!userHasPermission} />
              )}
            </>
          }
          isSet={!!avatarHash}
        />
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
          maxLength={25}
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
          disabled={!userHasPermission || !isValid}
        />
      </DialogSection>
    </>
  );
};

export default EditColonyDetailsDialogForm;
