import React, { useCallback, useState } from 'react';
import { FormikProps, FormikState } from 'formik';
import { defineMessages } from 'react-intl';
import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Input, Annotations, SelectOption } from '~core/Fields';
import Heading from '~core/Heading';

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
  safeLoading: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.safeLoading',
    defaultMessage: 'Loading Safe details...',
  },
  safeCheck: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.safeCheck',
    defaultMessage: `Safe {safeData, select,
      true {found}
      other {not found}
    } on {selectedChain}`,
  },
});

const getStatusText = (
  selectedChain: SelectOption,
  isLoadingAddress: boolean,
  status: FormikState<FormValues>,
  safeData?: any, // @TODO ADD IN Safe data Type when wiring up
) => {
  if (!status?.touched?.contractAddress || status?.errors?.contractAddress) {
    return {};
  }
  if (isLoadingAddress) {
    return { status: MSG.safeLoading };
  }
  if (safeData === null) {
    return {
      status: MSG.safeCheck,
      statusValues: {
        safeData,
        selectedChain: selectedChain.label.toString(),
      },
    };
  }
  return {
    status: MSG.safeCheck,
    statusValues: {
      safeData,
      selectedChain: selectedChain.label.toString(),
    },
  };
};

interface Props {
  back: () => void;
  status: FormikState<FormValues>;
  networkOptions: SelectOption[];
}

const AddExistingSafeDialogForm = ({
  back,
  networkOptions,
  status,
  handleSubmit,
  isSubmitting,
  isValid,
}: Props & FormikProps<FormValues>) => {
  const [selectedChain, setSelectedChain] = useState<SelectOption>(
    networkOptions[0],
  );

  // @TODO Add in actual API check when wiring up.
  const safeData = true;
  const isLoadingSafe = false;

  const handleNetworkChange = useCallback(
    (fromNetworkValue) => {
      const selectedNetwork = networkOptions.find(
        (option) => option.value === fromNetworkValue,
      );
      if (selectedNetwork) {
        setSelectedChain(selectedNetwork);
      }
    },
    [networkOptions, setSelectedChain],
  );

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
            options={networkOptions}
            label={MSG.chain}
            name="chainId"
            appearance={{ theme: 'grey', width: 'fluid' }}
            disabled={isSubmitting}
            onChange={handleNetworkChange}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <Input
          name="contractAddress"
          label={MSG.contract}
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={isSubmitting}
          {...getStatusText(selectedChain, isLoadingSafe, status, safeData)}
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
