import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { FormikProps } from 'formik';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import Heading from '~core/Heading';

import { useLoggedInUser, Colony } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { canEnterRecoveryMode } from '~modules/users/checks';

import { FormValues } from './RemoveSafeDialog';
import styles from './RemoveSafeDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.RemoveSafeDialog.RemoveSafeDialogForm.title',
    defaultMessage: 'Remove safe',
  },
  desc: {
    id: 'dashboard.RemoveSafeDialog.RemoveSafeDialogForm.desc',
    defaultMessage: 'Select safe you wish to remove',
  },
});

interface Props {
  back: () => void;
  colony: Colony;
}

const RemoveSafeDialogForm = ({
  back,
  colony,
  handleSubmit,
  isSubmitting,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;

  const userHasPermission =
    hasRegisteredProfile && canEnterRecoveryMode(allUserRoles);

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      <DialogSection>
        <div className={styles.description}>
          <FormattedMessage {...MSG.desc} />
        </div>
      </DialogSection>
      <DialogSection>
        <p>blabla</p>
      </DialogSection>
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
          disabled={!userHasPermission || isSubmitting}
          data-test="removeSafeConfirmButton"
        />
      </DialogSection>
    </>
  );
};

export default RemoveSafeDialogForm;
