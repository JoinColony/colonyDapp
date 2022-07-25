import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFormikContext } from 'formik';

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

import { UserConsequences } from './types';
import { FormValues } from './CancelExpenditureDialog';
import styles from './CancelExpenditureDialog.css';

const MSG = defineMessages({
  header: {
    id: 'dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm.header',
    defaultMessage: 'Cancel payment',
  },
  ownersStake: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm.ownersStake`,
    defaultMessage: `Owner's stake`,
  },
  shouldBePenalized: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm.shouldBePenalized`,
    defaultMessage: 'Do you want to penalize the owner?',
  },
  penalize: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm.penalize`,
    defaultMessage: 'Penalize',
  },
  showMercy: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm.showMercy`,
    defaultMessage: 'Show mercy',
  },
  penalizeMessage: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm.penalizeMessage`,
    defaultMessage: 'Owner will lose their stake and equivalent reputation.',
  },
  mercyMessage: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm.mercyMessage`,
    defaultMessage: 'Owner will keep their stake and reputation.',
  },
  submit: {
    id: 'dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm.submit',
    defaultMessage: 'Submit',
  },
  textareaLabel: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm.textareaLabel`,
    defaultMessage: `Explain why you're cancelling this payment (optional)`,
  },
  effectTooltip: {
    id: `dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm.effectTooltip`,
    defaultMessage: `Decide what to do with the owner's stake when cancelling this Advanced Payment.`,
  },
  createDomain: {
    id: `dashboard.EscrowFundsDialog.CancelExpenditureDialogForm.creationTarget`,
    defaultMessage: 'Motion will be created in',
  },
});

const displayName =
  'dashboard.CancelExpenditureDialog.CancelExpenditureDialogForm';

interface Props {
  close: () => void;
  colony: Colony;
  onCancelExpenditure: (isForce: boolean) => void;
  isForce: boolean;
  setIsForce: React.Dispatch<React.SetStateAction<boolean>>;
  isVotingExtensionEnabled: boolean;
}

const CancelExpenditureDialogForm = ({
  close,
  colony,
  onCancelExpenditure,
  isForce,
  setIsForce,
  isVotingExtensionEnabled,
}: Props) => {
  const { isSubmitting, values, handleSubmit } = useFormikContext<FormValues>();
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
    isForce,
  );

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setDomainID(motionDomainId),
    [],
  );

  useEffect(() => {
    if (values.forceAction !== isForce) {
      setIsForce(values.forceAction);
    }
  }, [isForce, setIsForce, values]);

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
              [styles.selected]: values.effect === UserConsequences.Penalize,
            })}
          >
            <Radio
              name="effect"
              value={UserConsequences.Penalize}
              checked={values.effect === UserConsequences.Penalize}
              elementOnly
            >
              <FormattedMessage {...MSG.penalize} />
            </Radio>
          </div>
          <div
            className={classNames(styles.radioWrapper, {
              [styles.selected]: values.effect === UserConsequences.Mercy,
            })}
          >
            <Radio
              name="effect"
              value={UserConsequences.Mercy}
              checked={values.effect === UserConsequences.Mercy}
              elementOnly
            >
              <FormattedMessage {...MSG.showMercy} />
            </Radio>
          </div>
        </div>
        <div
          className={classNames(styles.message, {
            [styles.messageWarning]:
              values.effect === UserConsequences.Penalize,
          })}
        >
          <FormattedMessage
            {...(values.effect === UserConsequences.Penalize
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
            onCancelExpenditure(isForce);
            close();
            handleSubmit();
          }}
        />
      </DialogSection>
    </Dialog>
  );
};

CancelExpenditureDialogForm.displayName = displayName;

export default CancelExpenditureDialogForm;
