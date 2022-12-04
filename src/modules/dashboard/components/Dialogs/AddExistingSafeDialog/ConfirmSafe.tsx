import React from 'react';
import { FormikProps } from 'formik';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Input, Annotations } from '~core/Fields';
import MaskedAddress from '~core/MaskedAddress';
import Avatar from '~core/Avatar';
import { SAFE_NAMES_MAP } from '~constants';

import { FormValues, CheckSafeProps } from './index';

import styles from './AddExistingSafeDialogForm.css';

const MSG = defineMessages({
  subtitle: {
    id: 'dashboard.AddExistingSafeDialog.ConfirmSafe.subtitle',
    defaultMessage: 'Step 3: Add Safe',
  },
  instructions: {
    id: 'dashboard.AddExistingSafeDialog.ConfirmSafe.instructions',
    defaultMessage: `Confirm the details of the Safe, and give the Safe a name in Colony.`,
  },
  chain: {
    id: 'dashboard.AddExistingSafeDialog.ConfirmSafe.chain',
    defaultMessage: 'Chain',
  },
  safe: {
    id: 'dashboard.AddExistingSafeDialog.ConfirmSafe.safe',
    defaultMessage: 'Safe',
  },
  annotation: {
    id: 'dashboard.AddExistingSafeDialog.ConfirmSafe.annotation',
    defaultMessage: "Explain why you're adding the Safe (optional)",
  },
  safeName: {
    id: 'dashboard.AddExistingSafeDialog.ConfirmSafe.safeName',
    defaultMessage: 'Name the Safe',
  },
  addSafe: {
    id: 'dashboard.AddExistingSafeDialog.ConfirmSafe.addSafe',
    defaultMessage: 'Add Safe',
  },
});

type ConfirmSafeProps = Pick<CheckSafeProps, 'setStepIndex'>;

interface SummaryRowProps {
  label: MessageDescriptor;
  item: JSX.Element;
}

const ConfirmSafe = ({
  isSubmitting,
  values: { chainId, contractAddress },
  isValid,
  setStepIndex,
  handleSubmit,
}: ConfirmSafeProps & FormikProps<FormValues>) => {
  const SummaryRow = ({ label, item }: SummaryRowProps) => {
    return (
      <div className={styles.summaryRow}>
        <FormattedMessage {...label} />
        {item}
      </div>
    );
  };

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <span className={styles.subtitle}>
          <FormattedMessage {...MSG.subtitle} />
        </span>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={`${styles.instructions} ${styles.step3Instructions}`}>
          <FormattedMessage {...MSG.instructions} />
        </div>
      </DialogSection>
      <DialogSection>
        <SummaryRow
          label={MSG.chain}
          item={
            <span className={styles.chainName}>
              {SAFE_NAMES_MAP[Number(chainId)]}
            </span>
          }
        />
        <SummaryRow
          label={MSG.safe}
          item={
            <div className={styles.safe}>
              <Avatar
                seed={contractAddress}
                placeholderIcon="at-sign-circle"
                title="Safe"
                size="xs"
              />
              <MaskedAddress address={contractAddress} />
            </div>
          }
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Input
          label={MSG.safeName}
          name="safeName"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={isSubmitting}
          // @NOTE There is no limit on Safe names, so, we can impose our own
          maxLength={20}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
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
          onClick={() => setStepIndex((step) => step - 1)}
          disabled={isSubmitting}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          text={MSG.addSafe}
          type="submit"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

ConfirmSafe.displayName = 'dashboard.AddExistingSafeDialog.ConfirmSafe';

export default ConfirmSafe;
