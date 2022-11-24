import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { defineMessages } from 'react-intl';

import { DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import { SelectOption } from '~core/Fields';
import { ColonySafe } from '~data/index';
import { Address } from '~types/index';
import { getTxServiceBaseUrl } from '~modules/dashboard/sagas/utils/safeHelpers';

import {
  CheckSafe,
  ConnectSafe,
  ConfirmSafe,
  SafeContract,
  FormValues,
} from './index';

import styles from './AddExistingSafeDialogForm.css';

export type SafeData = SafeContract | undefined | null | {} | 'alreadyExists';

const MSG = defineMessages({
  title: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.title',
    defaultMessage: 'Adding a Safe',
  },
});

export interface AddExistingSafeProps {
  back: () => void;
  networkOptions: SelectOption[];
  colonySafes: ColonySafe[];
  colonyAddress: Address;
  loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>][];
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

const AddExistingSafeDialogForm = ({
  networkOptions,
  values: { chainId, contractAddress },
  values,
  loadingState,
  stepIndex,
  setStepIndex,
  ...props
}: AddExistingSafeProps & FormikProps<FormValues>) => {
  const safeDataState = useState<SafeData>({});
  const [selectedChain, setSelectedChain] = useState<SelectOption>(
    // chainId's initial value is set from networkOptions, therefore will return
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    networkOptions.find((options) => options.value === chainId)!,
  );
  // Get base API url for the selected chain
  const baseURL = getTxServiceBaseUrl(selectedChain.label as string);

  const renderStep = () => {
    switch (stepIndex) {
      case 1:
        return (
          <CheckSafe
            {...props}
            networkOptions={networkOptions}
            values={values}
            setStepIndex={setStepIndex}
            baseURL={baseURL}
            loadingState={loadingState}
            safeDataState={safeDataState}
            selectedChain={selectedChain}
            setSelectedChain={setSelectedChain}
          />
        );
      case 2:
        return (
          <ConnectSafe
            {...props}
            values={values}
            setStepIndex={setStepIndex}
            safeAddress={contractAddress}
          />
        );
      case 3:
        return (
          <ConfirmSafe
            {...props}
            values={values}
            setStepIndex={setStepIndex}
            loadingState={loadingState[1]}
            selectedChain={selectedChain}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className={styles.main}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.headingContainer}>
          <Heading
            appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            text={MSG.title}
          />
        </div>
      </DialogSection>
      {renderStep()}
    </div>
  );
};

AddExistingSafeDialogForm.displayName =
  'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm';

export default AddExistingSafeDialogForm;
