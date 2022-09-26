import React from 'react';
import { FormikProps } from 'formik';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import classnames from 'classnames';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import ExternalLink from '~core/ExternalLink';
import Icon from '~core/Icon';
import { GNOSIS_AMB_BRIDGES, GNOSIS_NETWORK } from '~constants';
import { useClipboardCopy } from '~modules/dashboard/hooks';

import { FormValues, AddExistingSafeProps } from './index';

import styles from './AddExistingSafeDialogForm.css';

const MSG = defineMessages({
  subtitle: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.subtitle',
    defaultMessage: 'Step 2: Connect the Safe',
  },
  warning: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.warning',
    defaultMessage: `<span>Warning.</span> Bridging across chains can have an element of risk.`,
  },
  instructions: {
    id: 'dashboard.AddExistingSafeDialog.ConnectSafe.instructions',
    defaultMessage: `To give this colony permission to control the Safe, you need to provide the follow details in the Zodiac Bridge Module in your Safe. <a>Read the set up instructions here.</a>`,
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
});

const instructionsHref = `https://colony.gitbook.io/colony/advanced-features/safe-control-gnosis-safe`;

type ConnectSafeProps = Pick<
  AddExistingSafeProps,
  'colonyAddress' | 'setStepIndex'
>;

interface CopyableProps {
  label: MessageDescriptor;
  text: string;
}

const ConnectSafe = ({
  isSubmitting,
  values: { chainId },
  setStepIndex,
  colonyAddress,
}: ConnectSafeProps & FormikProps<FormValues>) => {
  const CopyableData = ({ label, text }: CopyableProps) => {
    const { isCopied, handleClipboardCopy } = useClipboardCopy(text);
    return (
      <div className={styles.copyableContainer}>
        <span className={styles.subtitle}>
          <FormattedMessage {...label} />
        </span>
        <div
          className={classnames(styles.copyable, styles.fat, {
            [styles.copied]: isCopied,
          })}
        >
          <span>{text}</span>
          <Icon
            appearance={{ size: 'normal' }}
            name="copy"
            onClick={handleClipboardCopy}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.warning}>
          <FormattedMessage
            {...MSG.warning}
            values={{
              span: (chunks) => <span>{chunks}</span>,
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
                <ExternalLink text={chunks} href={instructionsHref} />
              ),
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
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

ConnectSafe.displayName = 'dashboard.AddExistingSafeDialog.ConnectSafe';

export default ConnectSafe;
