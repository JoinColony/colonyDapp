import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { FormikProps } from 'formik';
import Decimal from 'decimal.js';
import { BigNumber } from 'ethers/utils';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import ExternalLink from '~core/ExternalLink';
import { Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import {
  StakingSlider,
  StakingAmounts,
} from '~dashboard/ActionsPage/StakingWidget';
import StakingValidationError from '~dashboard/ActionsPage/StakingValidationError';

import { Colony } from '~data/index';

import { FormValues } from './RaiseObjectionDialog';
import styles from './RaiseObjectionDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.RaiseObjectionDialog.RaiseObjectionDialogForm.title',
    defaultMessage: 'Raise an objection',
  },
  objectionDescription: {
    id: `dashboard.RaiseObjectionDialog.RaiseObjectionDialogForm.objectionDescription`,
    defaultMessage: `
    You are about to make an objection to the motion. If fully staked,
    it will immediately start a voting process to determine whether
    the motion should pass. <a>Learn more.</a>`,
  },
  annotation: {
    id: 'dashboard.RaiseObjectionDialog.RaiseObjectionDialogForm.annotation',
    defaultMessage: 'Explain why you’re making this objection (optional)',
  },
  stakeButton: {
    id: 'dashboard.RaiseObjectionDialog.RaiseObjectionDialogForm.stakeButton',
    defaultMessage: 'Stake',
  },
});

const OBJECTION_HELP_LINK = `https://colony.io/dev/docs/colonynetwork/whitepaper-tldr-objections-and-disputes#objections`;

export interface Props extends StakingAmounts {
  colony: Colony;
  canUserStake: boolean;
  userInactivatedTokens: BigNumber;
  userActivatedTokens: Decimal;
  cancel: () => void;
}

const RaiseObjectionDialogForm = ({
  colony,
  handleSubmit,
  isSubmitting,
  canUserStake,
  values,
  cancel,
  userInactivatedTokens,
  userActivatedTokens,
  remainingToFullyNayStaked,
  ...props
}: Props & FormikProps<FormValues>) => {
  const decimalAmount = new Decimal(values.amount)
    .times(remainingToFullyNayStaked)
    .div(100);
  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <FormattedMessage
          {...MSG.objectionDescription}
          values={{
            a: (chunks) => (
              <ExternalLink href={OBJECTION_HELP_LINK} className={styles.link}>
                {chunks}
              </ExternalLink>
            ),
          }}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.slider}>
          <StakingSlider
            colony={colony}
            canUserStake={canUserStake}
            values={values}
            appearance={{ theme: 'danger' }}
            isObjection
            remainingToFullyNayStaked={remainingToFullyNayStaked}
            userActivatedTokens={userActivatedTokens}
            {...props}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ border: 'top' }}>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          maxLength={90}
          disabled={!canUserStake}
        />
      </DialogSection>
      <DialogSection>
        <StakingValidationError
          userActivatedTokens={userActivatedTokens}
          userInactivatedTokens={userInactivatedTokens}
          decimalAmount={decimalAmount}
        />
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          text={{ id: 'button.cancel' }}
          onClick={cancel}
        />
        <span className={styles.submitButton}>
          <Button
            appearance={{ theme: 'pink', size: 'large' }}
            text={MSG.stakeButton}
            onClick={() => handleSubmit()}
            type="submit"
            loading={isSubmitting}
            disabled={!canUserStake || userActivatedTokens.lt(decimalAmount)}
          />
        </span>
      </DialogSection>
    </>
  );
};

export default RaiseObjectionDialogForm;
