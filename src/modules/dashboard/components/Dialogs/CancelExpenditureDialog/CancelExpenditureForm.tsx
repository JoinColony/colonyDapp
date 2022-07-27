import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';

import Dialog, { DialogSection } from '~core/Dialog';
import { tokens as tokensMock } from '~dashboard/ExpenditurePage/ExpenditureSettings/constants';
import { Annotations, Radio, Toggle } from '~core/Fields';
import { Colony, useLoggedInUser } from '~data/index';
import Heading from '~core/Heading';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Button from '~core/Button';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import IconTooltip from '~core/IconTooltip';

import { PenalizeType } from './types';
import { FormValues } from './CancelExpenditureDialog';
import styles from './CancelExpenditureDialog.css';

const MSG = defineMessages({
  header: {
    id: 'dashboard.CancelExpenditureDialog.CancelExpenditureForm.header',
    defaultMessage: 'Cancel payment',
  },
  ownersStake: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureForm.ownersStake`,
    defaultMessage: `Owner's stake`,
  },
  shouldBePenalized: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureForm.shouldBePenalized`,
    defaultMessage: 'Do you want to penalize the owner?',
  },
  penalize: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureForm.penalize`,
    defaultMessage: 'Penalize',
  },
  showMercy: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureForm.showMercy`,
    defaultMessage: 'Show mercy',
  },
  penalizeMessage: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureForm.penalizeMessage`,
    defaultMessage: 'Owner will lose their stake and equivalent reputation.',
  },
  mercyMessage: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureForm.mercyMessage`,
    defaultMessage: 'Owner will keep their stake and reputation.',
  },
  submit: {
    id: 'dashboard.CancelExpenditureDialog.CancelExpenditureForm.submit',
    defaultMessage: 'Submit',
  },
  textareaLabel: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureForm.textareaLabel`,
    defaultMessage: `Explain why you're cancelling this payment (optional)`,
  },
  effectTooltip: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureForm.effectTooltip`,
    defaultMessage: `Decide what to do with the owner's stake when cancelling this Advanced Payment.`,
  },
  createDomain: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureForm.creationTarget`,
    defaultMessage: 'Motion will be created in',
  },
});

const displayName = 'dashboard.CancelExpenditureDialog.CancelExpenditureForm';

interface Props {
  close: () => void;
  colony: Colony;
  onCancelExpenditure: (isForce: boolean) => void;
  isVotingExtensionEnabled: boolean;
}

const CancelExpenditureForm = ({
  close,
  colony,
  onCancelExpenditure,
  isVotingExtensionEnabled,
  values,
  isSubmitting,
  handleSubmit,
}: Props & FormikProps<FormValues>) => {
  const [domainID, setDomainID] = useState<number>();
  // temporary value
  const [token] = tokensMock;
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canCancelExpenditure = hasRegisteredProfile && hasRoot(allUserRoles);

  const [userHasPermission] = useDialogActionPermissions(
    colony.colonyAddress,
    canCancelExpenditure,
    isVotingExtensionEnabled,
    values.forceAction,
  );

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setDomainID(motionDomainId),
    [],
  );

  return (
    <Dialog cancel={close}>
      <DialogSection>
        <div
          className={classNames(
            styles.row,
            styles.withoutPadding,
            styles.forceRow,
          )}
        >
          {colony && (
            <MotionDomainSelect
              colony={colony}
              onDomainChange={handleMotionDomainChange}
              initialSelectedDomain={domainID}
            />
          )}
          {canCancelExpenditure && isVotingExtensionEnabled && (
            <div className={styles.toggleContainer}>
              <Toggle
                label={{ id: 'label.force' }}
                name="forceAction"
                appearance={{ theme: 'danger' }}
                disabled={!userHasPermission || isSubmitting}
                tooltipText={{ id: 'tooltip.forceAction' }}
                tooltipPopperOptions={{
                  placement: 'top-end',
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [-5, 6],
                      },
                    },
                  ],
                  strategy: 'fixed',
                }}
              />
            </div>
          )}
        </div>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          className={styles.title}
        >
          <FormattedMessage {...MSG.header} />
        </Heading>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={classNames(styles.row, styles.tokens)}>
          <FormattedMessage {...MSG.ownersStake} />
          <div className={styles.value}>
            <TokenIcon
              className={styles.tokenIcon}
              token={token}
              name={token.name || token.address}
            />
            <Numeral unit={getTokenDecimalsWithFallback(0)} value={0.1} />
            {token.symbol}
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.radioGroup}>
          <div className={styles.textWrapper}>
            <FormattedMessage {...MSG.shouldBePenalized} />
            <IconTooltip
              icon="question-mark"
              tooltipText={MSG.effectTooltip}
              appearance={{ size: 'huge' }}
              tooltipPopperOptions={{
                placement: 'top',
                strategy: 'fixed',
              }}
            />
          </div>
          <div
            className={classNames(styles.radioWrapper, {
              [styles.selected]: values.effect === PenalizeType.Penalize,
            })}
          >
            <Radio
              name="effect"
              value={PenalizeType.Penalize}
              checked={values.effect === PenalizeType.Penalize}
              elementOnly
            >
              <FormattedMessage {...MSG.penalize} />
            </Radio>
          </div>
          <div
            className={classNames(styles.radioWrapper, {
              [styles.selected]: values.effect === PenalizeType.Mercy,
            })}
          >
            <Radio
              name="effect"
              value={PenalizeType.Mercy}
              checked={values.effect === PenalizeType.Mercy}
              elementOnly
            >
              <FormattedMessage {...MSG.showMercy} />
            </Radio>
          </div>
        </div>
        <div
          className={classNames(styles.message, {
            [styles.messageWarning]: values.effect === PenalizeType.Penalize,
          })}
        >
          <FormattedMessage
            {...(values.effect === PenalizeType.Penalize
              ? MSG.penalizeMessage
              : MSG.mercyMessage)}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.annotations}>
          <Annotations
            label={MSG.textareaLabel}
            name="annotation"
            maxLength={90}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{
            theme: 'primary',
            size: 'large',
          }}
          style={{
            width: styles.buttonWidth,
          }}
          autoFocus
          text={MSG.submit}
          type="submit"
          onClick={() => {
            onCancelExpenditure(values.forceAction);
            close();
            handleSubmit();
          }}
        />
      </DialogSection>
    </Dialog>
  );
};

CancelExpenditureForm.displayName = displayName;

export default CancelExpenditureForm;
