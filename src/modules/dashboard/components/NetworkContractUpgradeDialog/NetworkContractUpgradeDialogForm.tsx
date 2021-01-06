import React from 'react';
import { defineMessages } from 'react-intl';
import { FormikProps } from 'formik';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Annotations } from '~core/Fields';
import Heading from '~core/Heading';

import { Colony } from '~data/index';

import { FormValues } from './NetworkContractUpgradeDialog';
import styles from './NetworkContractUpgradeDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.NetworkContractUpgradeDialog.title',
    defaultMessage: 'Upgrade Colony',
  },
  annotation: {
    id: 'dashboard.NetworkContractUpgradeDialog.annotation',
    defaultMessage: 'Explain why you are upgrading this colony (optional)',
  },
});

interface Props {
  back: () => void;
  colony: Colony;
}

const NetworkContractUpgradeDialogForm = ({
  back,
}: Props & FormikProps<FormValues>) => {
  return (
    <>
      <DialogSection>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      <DialogSection>
        <Annotations label={MSG.annotation} name="annotation" />
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
        />
      </DialogSection>
    </>
  );
};

export default NetworkContractUpgradeDialogForm;
