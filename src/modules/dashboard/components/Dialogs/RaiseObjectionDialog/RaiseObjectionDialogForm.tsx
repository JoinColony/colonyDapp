import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Editor } from '@tiptap/react';
import { FormikProps } from 'formik';
import Decimal from 'decimal.js';

import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import ExternalLink from '~core/ExternalLink';
import { InputLabel } from '~core/Fields';
import RichTextEditor from '~core/RichTextEditor/RichTextEditor';
import Heading from '~core/Heading';
import {
  StakingSlider,
  StakingAmounts,
} from '~dashboard/ActionsPage/StakingWidget';

import { Colony } from '~data/index';
import { MD_OBJECTIONS_HELP } from '~externalUrls';

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
    the motion should pass. <a>Learn more</a>`,
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

export interface Props extends StakingAmounts {
  colony: Colony;
  canUserStake: boolean;
  userActivatedTokens: Decimal;
  editor: Editor | null;
  limit: number;
  cancel: () => void;
}

const RaiseObjectionDialogForm = ({
  colony,
  handleSubmit,
  isSubmitting,
  canUserStake,
  values,
  editor,
  limit,
  cancel,
  userActivatedTokens,
  remainingToFullyNayStaked,
  minUserStake,
  ...props
}: Props & FormikProps<FormValues>) => {
  const decimalAmount = new Decimal(values.amount)
    .times(new Decimal(remainingToFullyNayStaked).minus(minUserStake))
    .div(100)
    .plus(minUserStake)
    .round();

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
              <ExternalLink href={MD_OBJECTIONS_HELP}>{chunks}</ExternalLink>
            ),
          }}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.slider}>
          <StakingSlider
            colony={colony}
            canUserStake={canUserStake && !isSubmitting}
            values={values}
            appearance={{ theme: 'danger', size: 'thick' }}
            isObjection
            remainingToFullyNayStaked={remainingToFullyNayStaked}
            userActivatedTokens={userActivatedTokens}
            minUserStake={minUserStake}
            {...props}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ border: 'top' }}>
        <DialogSection>
          <InputLabel
            label={MSG.annotation}
            appearance={{ colorSchema: 'grey' }}
          />
          {editor && (
            <RichTextEditor
              editor={editor}
              isSubmitting={isSubmitting}
              limit={limit}
              disabled={!canUserStake || isSubmitting}
            />
          )}
        </DialogSection>
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
            disabled={
              !canUserStake ||
              userActivatedTokens.lt(decimalAmount) ||
              isSubmitting
            }
            dataTest="objectDialogStakeButton"
          />
        </span>
      </DialogSection>
    </>
  );
};

export default RaiseObjectionDialogForm;
