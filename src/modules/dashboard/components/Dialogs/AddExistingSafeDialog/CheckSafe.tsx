import React, { useEffect } from 'react';
import { FormikProps, useField } from 'formik';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl,
} from 'react-intl';
import { isAddress } from 'web3-utils';
import classnames from 'classnames';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import {
  Select,
  Input,
  SelectOption,
  InputStatus,
  InputLabel,
} from '~core/Fields';
import { FETCH_ABORTED } from '~constants';
import { SimpleMessageValues } from '~types/index';
import Avatar from '~core/Avatar';
import ExternalLink from '~core/ExternalLink';
import { ADD_SAFE_INSTRUCTIONS } from '~externalUrls';

import { FormValues, AddExistingSafeProps, SafeData } from './index';

import styles from './AddExistingSafeDialogForm.css';
import Icon from '~core/Icon';

const MSG = defineMessages({
  subtitle: {
    id: 'dashboard.AddExistingSafeDialog.CheckSafe.subtitle',
    defaultMessage: 'Step 1: Check for the Safe',
  },
  chain: {
    id: 'dashboard.AddExistingSafeDialog.CheckSafe.chain',
    defaultMessage: 'Select Chain',
  },
  contract: {
    id: 'dashboard.AddExistingSafeDialog.CheckSafe.contract',
    defaultMessage: 'Add Safe contract',
  },
  safeLoading: {
    id: 'dashboard.AddExistingSafeDialog.CheckSafe.safeLoading',
    defaultMessage: 'Loading Safe details...',
  },
  safeCheck: {
    id: 'dashboard.AddExistingSafeDialog.CheckSafe.safeCheck',
    defaultMessage: `Safe found on {selectedChain}`,
  },
  safe: {
    id: 'dashboard.AddExistingSafeDialog.CheckSafe.safe',
    defaultMessage: 'Safe',
  },
  callout: {
    id: 'dashboard.AddExistingSafeDialog.CheckSafe.callout',
    defaultMessage: '<span>Important!</span>  Read the instructions first.',
  },
  calloutLink: {
    id: 'dashboard.AddExistingSafeDialog.CheckSafe.calloutLink',
    defaultMessage: 'Set up instructions',
  },
  important: {
    id: 'dashboard.AddExistingSafeDialog.CheckSafe.important',
    defaultMessage: 'Important!',
  },
});

export interface CheckSafeProps
  extends Omit<AddExistingSafeProps, 'stepIndex'> {
  safeDataState: [SafeData, React.Dispatch<React.SetStateAction<SafeData>>];
  selectedChain: SelectOption;
  setSelectedChain: React.Dispatch<React.SetStateAction<SelectOption>>;
  baseURL: string;
}

export interface SafeContract {
  address: string;
  name: string;
  displayName: string;
  logoUri: string;
  contractAbi: any;
  trustedForDelegateCall: boolean;
}

export interface StatusText {
  status: MessageDescriptor;
  statusValues?: SimpleMessageValues;
}

const CheckSafe = ({
  back,
  networkOptions,
  isSubmitting,
  dirty,
  errors,
  setStepIndex,
  selectedChain,
  setSelectedChain,
  values: { contractAddress, moduleContractAddress },
  loadingState,
  validateField,
}: CheckSafeProps & FormikProps<FormValues>) => {
  const { formatMessage } = useIntl();

  const [
    [isLoadingSafe, setIsLoadingSafe],
    [, setIsLoadingModule],
  ] = loadingState;

  const [
    ,
    { error: addressError, touched: addressTouched, value: address },
    { setError: setAddressError, setTouched: setAddressTouched },
  ] = useField<string>('contractAddress');

  useEffect(() => {
    if (isLoadingSafe && addressError) {
      setAddressError('');
    }
  }, [isLoadingSafe, addressError, setAddressError]);

  const getStatusText = (): StatusText | {} => {
    const isValidAddress =
      !addressError && addressTouched && isAddress(address);

    if (isLoadingSafe) {
      return { status: MSG.safeLoading };
    }

    if (!isValidAddress) {
      return {};
    }

    return {
      status: MSG.safeCheck,
      statusValues: {
        selectedChain: selectedChain.label.toString(),
      },
    };
  };

  const handleNetworkChange = (fromNetworkValue: string) => {
    const selectedNetwork = networkOptions.find(
      (option) => option.value === fromNetworkValue,
    );
    if (selectedNetwork) {
      setSelectedChain(selectedNetwork);
    }
    if (isAddress(address) && addressTouched) {
      setIsLoadingSafe(true);
    }
  };

  const handleNextStep = () => {
    setStepIndex((step) => step + 1);
    if (moduleContractAddress) {
      setIsLoadingModule(true);
      // Don't run validation until step has increased.
      setTimeout(() => validateField('moduleContractAddress'), 0);
    }
  };

  /*
   * Checks if Contract Address and Chain Id fields are error-free.
   */
  const isCheckSafeValid =
    addressTouched &&
    !Object.keys(errors).filter(
      (key) => key === 'contractAddress' || key === 'chainId',
    ).length;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={classnames(styles.subtitle, styles.step1Subtitle)}>
          <FormattedMessage {...MSG.subtitle} />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.callout}>
          <div className={styles.calloutContainer}>
            <Icon
              name="triangle-warning"
              className={`${styles.warningIcon} ${styles.warningIconCheckSafe}`}
              title={MSG.important}
            />
            <FormattedMessage
              {...MSG.callout}
              values={{
                span: (chunks) => (
                  <span className={styles.calloutWarning}>{chunks}</span>
                ),
              }}
            />
          </div>
          <ExternalLink
            href={ADD_SAFE_INSTRUCTIONS}
            className={styles.calloutLink}
          >
            <FormattedMessage {...MSG.calloutLink} />
          </ExternalLink>
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
        <div className={styles.avatarIcon}>
          <InputLabel
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            label={MSG.contract}
          />
          <Input
            name="contractAddress"
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            disabled={isSubmitting}
            elementOnly
            onChange={(e) => {
              if (!addressTouched) {
                setAddressTouched(true);
              }

              if (isAddress(e.target.value)) {
                setIsLoadingSafe(true);
              }
            }}
            onBlur={(e) => {
              if (!addressTouched && isAddress(e.target.value)) {
                setIsLoadingSafe(true);
              }
            }}
          />
          <InputStatus
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            touched={addressTouched}
            error={addressError === FETCH_ABORTED ? undefined : addressError}
            {...getStatusText()}
          />
          <Avatar
            seed={contractAddress}
            placeholderIcon="at-sign-circle"
            title={formatMessage(MSG.safe)}
            size="xs"
          />
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
          onClick={handleNextStep}
          text={{ id: 'button.next' }}
          type="submit"
          loading={isSubmitting}
          disabled={
            !isCheckSafeValid || isSubmitting || !dirty || isLoadingSafe
          }
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

CheckSafe.displayName = 'dashboard.AddExistingSafeDialog.CheckSafe';

export default CheckSafe;
