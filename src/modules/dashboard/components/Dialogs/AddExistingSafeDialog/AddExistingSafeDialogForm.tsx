import React, { useEffect, useState } from 'react';
import { FormikProps, useField } from 'formik';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Input, Annotations, SelectOption } from '~core/Fields';
import Heading from '~core/Heading';
import { GNOSIS_SAFE_NETWORKS } from '~constants';
import { SimpleMessageValues } from '~types/index';

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
    defaultMessage: "Explain why you're adding this Gnosis Safe (optional)",
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
  fetchFailed: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.fetchFailed',
    defaultMessage: `Could not fetch Safe details. Please check your connection and try again.`,
  },
});

interface Props {
  back: () => void;
  networkOptions: SelectOption[];
}

interface SafeContract {
  address: string;
  name: string;
  displayName: string;
  logoUri: string;
  contractAbi: any;
  trustedForDelegateCall: boolean;
}

interface StatusText {
  status: MessageDescriptor;
  statusValues?: SimpleMessageValues;
}

type SafeData = SafeContract | undefined | null;

const AddExistingSafeDialogForm = ({
  back,
  networkOptions,
  handleSubmit,
  isSubmitting,
  isValid,
}: Props & Partial<FormikProps<FormValues>>) => {
  const { formatMessage } = useIntl();

  const [selectedChain, setSelectedChain] = useState<SelectOption>(
    networkOptions[0],
  );
  const [safeData, setSafeData] = useState<SafeData>(undefined);
  const [isLoadingSafe, setIsLoadingSafe] = useState<boolean>(false);

  // Get base API url for the selected chain
  const baseURL = GNOSIS_SAFE_NETWORKS.filter(
    (network) => network.name === selectedChain.label,
  )[0].gnosisTxService;

  // Get Safe Address field status
  const [
    ,
    { error: addressError, touched: addressTouched, value: address },
  ] = useField<string>('contractAddress');

  const getSafeData = async (url: string) => {
    try {
      // Make request to get safe data
      const response = await fetch(url);
      if (response.status === 200) {
        // If safe address is found
        const data = (await response.json()) as SafeContract;
        setSafeData(data);
      } else {
        // If fetching is successful but returns any status code other than 200
        setSafeData(undefined);
      }
    } catch (e) {
      // If fetching produces an error (e.g. network error)
      setSafeData(null);
    }
    setIsLoadingSafe(false);
  };

  // When selected chain or address changes
  useEffect(() => {
    // If there's a valid address in the address input
    if (addressTouched && !addressError) {
      // Get safe data
      setIsLoadingSafe(true);
      getSafeData(`${baseURL}api/v1/safes/${address}/`);
    }
  }, [baseURL, address, addressTouched, addressError]);

  const handleNetworkChange = (fromNetworkValue: string) => {
    const selectedNetwork = networkOptions.find(
      (option) => option.value === fromNetworkValue,
    );
    if (selectedNetwork) {
      setSelectedChain(selectedNetwork);
    }
  };

  const getStatusText = (): StatusText | {} => {
    if (!addressTouched || addressError) {
      return {};
    }
    if (isLoadingSafe) {
      return { status: MSG.safeLoading };
    }

    /*
     * safeData will be undefined if fetching did not return a status code of 200
     * (i.e. safe is not present on selected chain)
     */

    if (safeData === undefined) {
      return {
        status: MSG.safeCheck,
        statusValues: {
          safeData,
          selectedChain: selectedChain.label.toString(),
        },
      };
    }

    /*
     * safeData will be null if fetching failed (e.g. network error)
     */

    if (safeData === null) {
      return {
        status: MSG.fetchFailed,
      };
    }
    return {
      status: MSG.safeCheck,
      statusValues: {
        safeData: true,
        selectedChain: selectedChain.label.toString(),
      },
    };
  };

  // If safe is not found, show error message
  let safeNotFoundError: string | undefined;

  if (addressTouched && !addressError && !isLoadingSafe) {
    if (safeData === undefined || safeData === null) {
      const notFoundMsg = getStatusText() as StatusText;
      safeNotFoundError = formatMessage(
        notFoundMsg.status,
        notFoundMsg?.statusValues,
      );
    }
  }

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
          forcedFieldError={safeNotFoundError}
          {...getStatusText()}
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
          onClick={handleSubmit && (() => handleSubmit())}
          text={{ id: 'button.confirm' }}
          type="submit"
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
