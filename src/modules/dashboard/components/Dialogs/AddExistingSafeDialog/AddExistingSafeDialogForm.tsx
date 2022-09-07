import React, { useEffect, useState } from 'react';
import { FormikProps, useField } from 'formik';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import { isAddress } from 'web3-utils';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Input, Annotations, SelectOption } from '~core/Fields';
import Heading from '~core/Heading';
import { SAFE_NETWORKS, SAFE_ALREADY_EXISTS } from '~constants';
import { SimpleMessageValues } from '~types/index';
import { ColonySafe } from '~data/index';

import { FormValues } from './AddExistingSafeDialog';

import styles from './AddExistingSafeDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.title',
    defaultMessage: 'Add Safe',
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
    defaultMessage: `Explain why you're adding this Safe (optional)`,
  },
  contract: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.contract',
    defaultMessage: 'Add Safe address',
  },
  safeLoading: {
    id: 'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.safeLoading',
    defaultMessage: 'Loading Safe details...',
  },
  alreadyExists: {
    id:
      'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm.alreadyExists',
    defaultMessage: 'Safe already exists in this colony.',
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
  colonySafes: ColonySafe[];
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

type SafeData = SafeContract | undefined | null | {} | 'alreadyExists';

const AddExistingSafeDialogForm = ({
  back,
  networkOptions,
  handleSubmit,
  isSubmitting,
  isValid,
  dirty,
  colonySafes,
}: Props & FormikProps<FormValues>) => {
  const { formatMessage } = useIntl();

  const [selectedChain, setSelectedChain] = useState<SelectOption>(
    networkOptions[0],
  );
  const [safeData, setSafeData] = useState<SafeData>({});
  const [safeNotFoundError, setSafeNotFoundError] = useState<
    string | undefined
  >(undefined);
  const [isLoadingSafe, setIsLoadingSafe] = useState<boolean>(false);

  // Get base API url for the selected chain
  const baseURL = SAFE_NETWORKS.filter(
    (network) => network.name === selectedChain.label,
  )[0].safeTxService;

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

    if (safeData === SAFE_ALREADY_EXISTS) {
      return {
        status: MSG.alreadyExists,
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

  const getCustomAddressError = () => {
    /*
     * If there is no validation error (via yup schema),
     * get the appropriate error and set in custom error state.
     * Basically a custom implementation of setFieldError. See: (https://github.com/jaredpalmer/formik/issues/1309)
     */
    if (!addressError) {
      const notFoundMsg = getStatusText() as StatusText;
      const error = formatMessage(
        notFoundMsg.status,
        notFoundMsg?.statusValues,
      );
      setSafeNotFoundError(error);
    }
  };

  // When selected chain or address changes
  useEffect(() => {
    // If there's a valid address in the address input
    if (addressTouched && !addressError && isAddress(address)) {
      /*
       * Check if safe already exists in colony
       */
      const isSafeAlreadyAdded = colonySafes.find(
        (safe) =>
          safe?.chainId === selectedChain.value &&
          safe?.contractAddress === address,
      );

      if (isSafeAlreadyAdded) {
        setSafeData(SAFE_ALREADY_EXISTS);
      } else {
        /*
         * If not, run api check
         */
        setSafeNotFoundError(undefined);
        setIsLoadingSafe(true);
        getSafeData(`${baseURL}api/v1/safes/${address}/`);
      }
    }
  }, [
    baseURL,
    address,
    selectedChain,
    addressTouched,
    addressError,
    colonySafes,
  ]);

  const handleNetworkChange = (fromNetworkValue: string) => {
    const selectedNetwork = networkOptions.find(
      (option) => option.value === fromNetworkValue,
    );
    if (selectedNetwork) {
      setSelectedChain(selectedNetwork);
    }
  };

  useEffect(() => {
    if (
      !isLoadingSafe &&
      (safeData === undefined ||
        safeData === null ||
        safeData === SAFE_ALREADY_EXISTS)
    ) {
      getCustomAddressError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeData, isLoadingSafe]);

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
          // @There is no limit on Safe names, so, we can impose our own
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
          type="submit"
          loading={isSubmitting}
          disabled={
            !isValid ||
            isSubmitting ||
            !dirty ||
            isLoadingSafe ||
            !!safeNotFoundError
          }
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

AddExistingSafeDialogForm.displayName =
  'dashboard.AddExistingSafeDialog.AddExistingSafeDialogForm';

export default AddExistingSafeDialogForm;
