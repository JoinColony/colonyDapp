import React, { useEffect } from 'react';
import { FormikProps, useField } from 'formik';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl,
} from 'react-intl';
import { isAddress } from 'web3-utils';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import ExternalLink from '~core/ExternalLink';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { Input } from '~core/Fields';

import {
  ETHEREUM_NETWORK,
  GNOSIS_AMB_BRIDGES,
  GNOSIS_NETWORK,
  SUPPORTED_SAFE_NETWORKS,
} from '~constants';
import {
  CONNECT_SAFE_INSTRUCTIONS,
  getModuleLink,
  MODULE_ADDRESS_INSTRUCTIONS,
  SAFE_CONTROL_LEARN_MORE,
} from '~externalUrls';
import { useClipboardCopy } from '~modules/dashboard/hooks';

import { FormValues, AddExistingSafeProps, StatusText } from './index';

import styles from './AddExistingSafeDialogForm.css';

const MSG = defineMessages({
  subtitle: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.subtitle',
    defaultMessage: 'Step 2: Connect the Safe',
  },
  warning: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.warning',
    defaultMessage: `Be sure you understand bridging before using. <a>Learn more</a>`,
  },
  instructions: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.instructions',
    defaultMessage: `Giving this colony permission to control a Safe requires installing an app within your Safe. <a>Bridge Module app setup instructions</a>`,
  },
  amb: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.amb',
    defaultMessage: 'AMB Contract Address',
  },
  controller: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.controller',
    defaultMessage: 'Controller Contract Address',
  },
  chain: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.chain',
    defaultMessage: 'Chain ID',
  },
  moduleLink: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.moduleLink',
    defaultMessage: `<a>Click to go to the Safe and add the Bridge Module</a>`,
  },
  moduleSubtitle: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.moduleSubtitle',
    defaultMessage: 'Add the module to the Safe',
  },
  moduleDetailsSubtitle: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.moduleDetailsSubtitle',
    defaultMessage: 'Add Bridge details',
  },
  copyDataTooltip: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.copyAddressTooltip',
    defaultMessage: `{isCopied, select,
      true {Copied}
      false {{tooltipMessage}}
    }`,
  },
  copyMessage: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.copyMessage',
    defaultMessage: 'Click to copy',
  },
  moduleAddress: {
    id: 'dashboard.AddExistingSafeDialog.ConfirmSafe.moduleAddress',
    defaultMessage: 'Module contract address',
  },
  where: {
    id: 'dashboard.AddExistingSafeDialog.ConfirmSafe.where',
    defaultMessage: 'Where to find this?',
  },
  moduleFound: {
    id: 'dashboard.AddExistingSafeDialog.ConfirmSafe.moduleFound',
    defaultMessage: 'Safe module found on {selectedChain}',
  },
  moduleLoading: {
    id: 'dashboard.AddExistingSafeDialog.ConfirmSafe.moduleLoading',
    defaultMessage: 'Loading Module details...',
  },
  beware: {
    id: 'dashboard.AddExistingSafeDialog.CheckSafe.beware',
    defaultMessage: 'Beware!',
  },
});

interface ConnectSafeProps
  extends Pick<AddExistingSafeProps, 'colonyAddress' | 'setStepIndex'> {
  safeAddress: string;
  loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

interface CopyableProps {
  label: MessageDescriptor;
  text: string;
}

const ConnectSafe = ({
  isSubmitting,
  values: { chainId },
  setStepIndex,
  colonyAddress,
  safeAddress,
  loadingState,
  errors,
}: ConnectSafeProps & FormikProps<FormValues>) => {
  const [
    { value: moduleAddress },
    { error: moduleError, touched: moduleTouched },
    { setError: setModuleError },
  ] = useField<string>('moduleContractAddress');
  const [isLoadingModule, setIsLoadingModule] = loadingState;

  useEffect(() => {
    if (isLoadingModule) {
      setModuleError('');
    }
    // setModuleError causes infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingModule]);

  const selectedChain = SUPPORTED_SAFE_NETWORKS.find(
    (network) => network.chainId === Number(chainId),
  );
  const { formatMessage } = useIntl();
  const moduleHref = getModuleLink(
    selectedChain?.shortName.toLowerCase() ||
      ETHEREUM_NETWORK.shortName.toLowerCase(),
    safeAddress,
  );
  const CopyableData = ({ label, text }: CopyableProps) => {
    const { isCopied, handleClipboardCopy } = useClipboardCopy(text);
    const tooltipMessage = formatMessage(MSG.copyMessage);

    return (
      <div className={styles.copyableContainer}>
        <span className={styles.subtitle}>
          <FormattedMessage {...label} />
        </span>
        <div className={`${styles.copyable} ${styles.fat}`}>
          <span>{text}</span>
          <Tooltip
            trigger="hover"
            content={
              <FormattedMessage
                {...MSG.copyDataTooltip}
                values={{ isCopied, tooltipMessage }}
              />
            }
          >
            <Icon
              appearance={{ size: 'normal' }}
              name="copy"
              onClick={handleClipboardCopy}
            />
          </Tooltip>
        </div>
      </div>
    );
  };

  const getStatusText = (): StatusText | {} => {
    const isValidAddress =
      !moduleError && moduleTouched && isAddress(moduleAddress);

    if (isLoadingModule) {
      return { status: MSG.moduleLoading };
    }

    if (!isValidAddress) {
      return {};
    }

    return {
      status: MSG.moduleFound,
      statusValues: {
        selectedChain: selectedChain?.name,
      },
    };
  };

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.warning}>
          <Icon
            name="triangle-warning"
            className={styles.warningIcon}
            title={MSG.beware}
          />
          <FormattedMessage
            {...MSG.warning}
            values={{
              a: (chunks) => (
                <ExternalLink
                  href={SAFE_CONTROL_LEARN_MORE}
                  className={styles.learnMoreLink}
                >
                  {chunks}
                </ExternalLink>
              ),
            }}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <span className={styles.subtitle}>
          <FormattedMessage {...MSG.subtitle} />
        </span>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.instructions}>
          <FormattedMessage
            {...MSG.instructions}
            values={{
              a: (chunks) => (
                <ExternalLink text={chunks} href={CONNECT_SAFE_INSTRUCTIONS} />
              ),
            }}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={`${styles.instructions} ${styles.moduleLinkSection}`}>
          <span className={styles.subtitle}>
            <FormattedMessage {...MSG.moduleSubtitle} />
          </span>
          <FormattedMessage
            {...MSG.moduleLink}
            values={{
              a: (chunks) => <ExternalLink text={chunks} href={moduleHref} />,
            }}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.info}>
          <CopyableData
            label={MSG.amb}
            text={GNOSIS_AMB_BRIDGES[chainId].foreignAMB}
          />
          <CopyableData label={MSG.controller} text={colonyAddress} />
          <CopyableData
            label={MSG.chain}
            text={GNOSIS_NETWORK.chainId.toString()}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.moduleContractAddressContainer}>
          <div className={`${styles.subtitle} ${styles.moduleAddressSubtitle}`}>
            <FormattedMessage {...MSG.moduleDetailsSubtitle} />
          </div>
          <div className={styles.moduleLabel}>
            <span>
              <FormattedMessage {...MSG.moduleAddress} />
            </span>
            <ExternalLink href={MODULE_ADDRESS_INSTRUCTIONS} text={MSG.where} />
          </div>
          <Input
            name="moduleContractAddress"
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            disabled={isSubmitting}
            onChange={(e) => {
              if (isAddress(e.target.value) && moduleTouched) {
                setIsLoadingModule(true);
              }
            }}
            onBlur={(e) => {
              if (!moduleTouched && isAddress(e.target.value)) {
                setIsLoadingModule(true);
              }
            }}
            {...getStatusText()}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={() => setStepIndex((step) => step - 1)}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => setStepIndex((step) => step + 1)}
          text={{ id: 'button.continue' }}
          type="submit"
          loading={isSubmitting}
          disabled={!!errors.moduleContractAddress || isLoadingModule}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

ConnectSafe.displayName = 'dashboard.AddExistingSafeDialog.ConnectSafe';

export default ConnectSafe;
