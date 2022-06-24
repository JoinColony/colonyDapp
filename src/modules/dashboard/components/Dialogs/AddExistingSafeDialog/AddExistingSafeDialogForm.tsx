import React from 'react';
import { FormikProps } from 'formik';
import { defineMessages } from 'react-intl';
import Button from '~core/Button';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Input, Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import { GNOSIS_SAFE_NETWORKS } from '~modules/constants';

import { FormValues } from './AddExistingSafeDialog';

import styles from './AddExistingSafeDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.title',
    defaultMessage: 'Add Gnosis Safe',
  },
  chain: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.chain',
    defaultMessage: 'Select Chain',
  },
  safeName: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.safeName',
    defaultMessage: 'Name the Safe',
  },
  annotation: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.annotation',
    defaultMessage: 'Explain why you’re adding this Gnosis Safe (optional)',
  },
  contract: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.contract',
    defaultMessage: 'Add Safe address',
  },
  safeFound: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.safeFound',
    // @TODO remove hardcoding here
    defaultMessage: 'Safe found on Gnosis Chain',
  },
});
interface Props extends ActionDialogProps {
  ethDomainId?: number;
}

const AddExistingSafeDialogForm = ({
  back,
  handleSubmit,
  isSubmitting,
  isValid,
}: Props & FormikProps<FormValues>) => {
  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.headingContainer}>
          <Heading
            appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            text={MSG.title}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.chainSelect}>
          <Select
            options={GNOSIS_SAFE_NETWORKS}
            label={MSG.chain}
            name="chainId"
            appearance={{ theme: 'grey', width: 'fluid' }}
            disabled={isSubmitting}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <Input
          name="contractAddress"
          label={MSG.contract}
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={isSubmitting}
          status={MSG.safeFound}
        />
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.safeName}
          name="safeName"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={isSubmitting}
          // @There is no limit on Gnosis Safe names, so, we can impose our own
          maxLength={20}
        />
      </DialogSection>

      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={isSubmitting}
          dataTest="addSafeAnnotation"
        />
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          text={{ id: 'button.confirm' }}
          loading={isSubmitting}
          disabled={!isValid}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

AddExistingSafeDialogForm.displayName =
  'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm';

export default AddExistingSafeDialogForm;
