import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';

import Avatar from '~core/Avatar';
import { DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';
import Button, { AddItemButton } from '~core/Button';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';

import { GNOSIS_SAFE_INTEGRATION_LEARN_MORE } from '~externalUrls';
import { Colony } from '~data/index';
import { Address } from '~types/index';

import { FormValues } from './GnosisControlSafeDialog';
import styles from './GnosisControlSafeForm.css';
import { Select } from '~core/Fields';

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
    defaultMessage: 'Select safe to control',
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
  buttonInteract: {
    id:
      'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.buttonInteract',
    defaultMessage: 'Interact',
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

const transactionOptions = [
  {
    value: 'transferFunds',
    label: 'Transfer funds',
  },
  {
    value: 'transferNft',
    label: 'Transfer NFT',
  },
  {
    value: 'contractInteraction',
    label: 'Contract interaction',
  },
  {
    value: 'rawTransaction',
    label: 'Raw transaction',
  },
];

const GnosisControlSafeForm = ({
  back,
  handleSubmit,
  safes,
}: Props & FormikProps<FormValues>) => {
  const updatedSafes = useMemo(
    () =>
      safes.map((item) => ({
        profile: {
          displayName: `${item.name} (${item.chain})`,
          walletAddress: item.address,
        },
      })),
    [safes],
  );

  return (
    <>
      <DialogSection>
        <Heading
          appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
          text={MSG.title}
        />
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
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            label={MSG.selectSafe}
            name="safeType"
            filter={filterUserSelection}
            renderAvatar={renderAvatar}
            data={updatedSafes}
            showMaskedAddress
            // disabled={inputDisabled}
            placeholder={MSG.safePickerPlaceholder}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Select
          options={transactionOptions}
          label={MSG.transactionLabel}
          // onChange={handleDomainChange}
          name="transactionType"
          appearance={{ theme: 'grey', width: 'fluid' }}
          placeholder={MSG.transactionPlaceholder}
          // disabled={isSubmitting}
        />
      </DialogSection>
      <DialogSection>
        <div className={styles.addTransaction}>
          <AddItemButton icon="circle-plus" text={MSG.buttonTransaction} />
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
          text={MSG.buttonInteract}
          // loading={isSubmitting}
          // disabled={!isValid || inputDisabled}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

GnosisControlSafeForm.displayName = displayName;

export default GnosisControlSafeForm;
