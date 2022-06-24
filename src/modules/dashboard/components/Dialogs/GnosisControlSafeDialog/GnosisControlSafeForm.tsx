import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';

import Avatar from '~core/Avatar';
import { DialogSection } from '~core/Dialog';
import { Select } from '~core/Fields';
import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';
import Button, { AddItemButton } from '~core/Button';
import { SingleSafePicker, filterUserSelection } from '~core/SingleUserPicker';

import { GNOSIS_SAFE_INTEGRATION_LEARN_MORE } from '~externalUrls';
import { Colony } from '~data/index';
import { Address } from '~types/index';

import { FormValues, transactionOptions } from './GnosisControlSafeDialog';
import styles from './GnosisControlSafeForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.title',
    defaultMessage: 'Control Safe',
  },
  description: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.description',
    defaultMessage: `You can use Control Safe to interact with other third party smart contracts. Be careful. <a>Learn more</a>`,
  },
  selectSafe: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.selectSafe',
    defaultMessage: 'Select Safe',
  },
  safePickerPlaceholder: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.safePickerPlaceholder`,
    defaultMessage: 'Select Safe to control',
  },
  transactionLabel: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.transactionLabel`,
    defaultMessage: 'Select transaction type',
  },
  transactionPlaceholder: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.transactionPlaceholder`,
    defaultMessage: 'Select transaction',
  },
  buttonTransaction: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.buttonTransaction`,
    defaultMessage: 'Add another transaction',
  },
  buttonCreateTransaction: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.buttonCreateTransaction`,
    defaultMessage: 'Create transaction',
  },
});

const displayName = 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm';

export interface GnosisSafe {
  name: string;
  address: Address;
  chain: string;
}

interface Props {
  colony: Colony;
  safes: GnosisSafe[];
  back?: () => void;
}

const renderAvatar = (address: string, item) => (
  <Avatar
    seed={address.toLocaleLowerCase()}
    size="xs"
    notSet={false}
    title={item.name}
    placeholderIcon="at-sign-circle"
  />
);

const GnosisControlSafeForm = ({
  back,
  handleSubmit,
  safes,
  isSubmitting,
  isValid,
}: Props & FormikProps<FormValues>) => {
  return (
    <>
      <DialogSection>
        <div className={styles.heading}>
          <Heading
            appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            text={MSG.title}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <FormattedMessage
          {...MSG.description}
          values={{
            a: (chunks) => (
              <ExternalLink href={GNOSIS_SAFE_INTEGRATION_LEARN_MORE}>
                {chunks}
              </ExternalLink>
            ),
          }}
        />
      </DialogSection>
      <DialogSection>
        <div className={styles.safePicker}>
          <SingleSafePicker
            appearance={{ width: 'wide' }}
            label={MSG.selectSafe}
            name="safe"
            filter={filterUserSelection}
            renderAvatar={renderAvatar}
            data={safes}
            showMaskedAddress
            disabled={isSubmitting}
            placeholder={MSG.safePickerPlaceholder}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Select
          options={transactionOptions}
          label={MSG.transactionLabel}
          name="transactionType"
          appearance={{ theme: 'grey', width: 'fluid' }}
          placeholder={MSG.transactionPlaceholder}
          disabled={isSubmitting}
        />
      </DialogSection>
      <DialogSection>
        <div className={styles.addTransaction}>
          <AddItemButton text={MSG.buttonTransaction} disabled />
        </div>
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
          text={MSG.buttonCreateTransaction}
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

GnosisControlSafeForm.displayName = displayName;

export default GnosisControlSafeForm;
