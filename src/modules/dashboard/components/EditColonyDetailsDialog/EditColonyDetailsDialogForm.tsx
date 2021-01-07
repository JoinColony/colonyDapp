import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { FormikProps } from 'formik';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations, Input } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionsLabel from '~core/PermissionsLabel';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';

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

interface Props {
  back: () => void;
  colony: Colony;
}

const EditColonyDetailsDialogForm = ({
  back,
  colony,
  handleSubmit,
  isSubmitting,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;

  const userHasPermission = hasRegisteredProfile && hasRoot(allUserRoles);

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
        <Input
          label={MSG.name}
          name="name"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={!userHasPermission}
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
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
          disabled={!userHasPermission}
        />
      </DialogSection>
    </>
  );
};

export default EditColonyDetailsDialogForm;
