import React from 'react';
import { FormikProps } from 'formik';
import { defineMessages } from 'react-intl';
import Button from '~core/Button';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Input, Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import { chains } from './gnosisSafeChains';

import { FormValues } from './AddExistingSafeDialog';

import styles from './AddExistingSafeDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.AddExistingPaymentDialog.AddExistingSafeDialogForm.title',
    defaultMessage: 'Add Gnosis Safe',
  },
  chain: {
    id: 'dashboard.AddExistingPaymentDialog.AddExistingSafeDialogForm.chain',
    defaultMessage: 'Select Chain',
  },
  safeName: {
    id: 'dashboard.AddExistingPaymentDialog.AddExistingSafeDialogForm.safeName',
    defaultMessage: 'Name the safe',
  },
  annotation: {
    id:
      'dashboard.AddExistingPaymentDialog.AddExistingSafeDialogForm.annotation',
    defaultMessage: 'Explain why you’re adding this Gnosis Safe (optional)',
  },
  contract: {
    id: 'dashboard.AddExistingPaymentDialog.AddExistingSafeDialogForm.contract',
    defaultMessage: 'Add Safe Contract',
  },
  safeFound: {
    id:
      'dashboard.AddExistingPaymentDialog.AddExistingSafeDialogForm.safeFound',
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
            options={chains}
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
          maxLength={20}
        />
      </DialogSection>

      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={isSubmitting}
          maxLength={90}
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
          text={{ id: 'button.interact' }}
          loading={isSubmitting}
          disabled={!isValid}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

AddExistingSafeDialogForm.displayName =
  'dashboard.AddExistingPaymentDialog.AddExistingSafeDialogForm';

export default AddExistingSafeDialogForm;
